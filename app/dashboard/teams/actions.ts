"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MAX_TEAM_MEMBERS, MAX_TEAMS, getTeamEntitlement } from "@/lib/account";
import { cleanupMember, deleteTeamAndCleanup } from "@/lib/team-cleanup";

const emailSchema = z.string().trim().email();

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");
  return session;
}

async function requireOwnedTeam(teamId: string) {
  const session = await requireSession();
  const res = await db.query(
    `select id, owner_user_id from teams where id = $1 and (owner_user_id = $2 or owner_email = $3)`,
    [teamId, session.user.id, session.user.email]
  );
  if (res.rows.length === 0) throw new Error("You do not have permission for this team");
  return { session, team: res.rows[0] };
}

/** Sends the one-click sign-in email; the account is created when the link is used. */
async function sendInviteMagicLink(email: string) {
  try {
    await auth.api.signInMagicLink({
      body: { email, callbackURL: "/dashboard" },
      headers: new Headers()
    });
  } catch (error) {
    console.error(`Failed to send invite magic link to ${email}:`, error);
  }
}

export async function createTeam(name: string, memberEmails: string[]) {
  const session = await requireSession();

  const teamName = name.trim();
  if (teamName.length < 1 || teamName.length > 50) {
    return { error: "Enter a team name between 1 and 50 characters" };
  }

  const emails = [...new Set(memberEmails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
  for (const email of emails) {
    if (!emailSchema.safeParse(email).success) {
      return { error: `"${email}" is not a valid email address` };
    }
  }
  if (emails.includes(session.user.email.toLowerCase())) {
    return { error: "You are already the owner, no need to add your own email" };
  }
  if (emails.length > MAX_TEAM_MEMBERS) {
    return { error: `A team can have up to ${MAX_TEAM_MEMBERS} members` };
  }

  // A user can belong to only one team at a time
  if (emails.length > 0) {
    const takenRes = await db.query(
      `select email from team_members where email = any($1::text[])`,
      [emails]
    );
    if (takenRes.rows.length > 0) {
      const taken = takenRes.rows.map((row) => row.email).join(", ");
      return { error: `Already a member of another team: ${taken}` };
    }
  }

  // Team creation requires a completed team-granting purchase and
  // fewer than MAX_TEAMS existing teams
  const entitlement = await getTeamEntitlement(session.user.id);
  if (!entitlement) {
    const owned = await db.query(
      `select count(*)::int as count from teams where owner_user_id = $1`,
      [session.user.id]
    );
    return {
      error:
        owned.rows[0].count >= MAX_TEAMS
          ? `You can create up to ${MAX_TEAMS} teams`
          : "You need a Premium license to create a team"
    };
  }

  const client = await db.connect();
  let teamId: string;
  try {
    await client.query("begin");
    const teamRes = await client.query(
      `insert into teams (name, purchase_id, owner_user_id, owner_email)
       values ($1, $2, $3, $4) returning id`,
      [teamName, entitlement.purchaseId, session.user.id, session.user.email]
    );
    teamId = teamRes.rows[0].id;

    for (const email of emails) {
      const userRes = await client.query(`select "id" from "user" where "email" = $1`, [email]);
      await client.query(
        `insert into team_members (team_id, email, user_id)
         values ($1, $2, $3) on conflict (team_id, email) do nothing`,
        [teamId, email, userRes.rows[0]?.id ?? null]
      );
    }
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    if ((error as { code?: string }).code === "23505") {
      return { error: "One of the emails is already a member of another team" };
    }
    console.error("Team creation failed:", error);
    return { error: "Could not create the team. Please try again." };
  } finally {
    client.release();
  }

  // Invitations go out after the team is committed
  for (const email of emails) {
    await sendInviteMagicLink(email);
  }

  revalidatePath("/dashboard/teams");
  return { success: true };
}

export async function addTeamMember(teamId: string, formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) {
    return { error: "Enter a valid email address" };
  }
  const normalized = email.data.toLowerCase();

  const { session } = await requireOwnedTeam(teamId);
  if (normalized === session.user.email.toLowerCase()) {
    return { error: "You are already the owner of this team" };
  }

  // A user can belong to only one team at a time
  const existingRes = await db.query(
    `select team_id from team_members where email = $1 limit 1`,
    [normalized]
  );
  if (existingRes.rows.length > 0) {
    return {
      error:
        existingRes.rows[0].team_id === teamId
          ? "This email is already a member of this team"
          : "This email is already a member of another team"
    };
  }

  const countRes = await db.query(
    `select count(*)::int as count from team_members where team_id = $1`,
    [teamId]
  );
  if (countRes.rows[0].count >= MAX_TEAM_MEMBERS) {
    return { error: `A team can have up to ${MAX_TEAM_MEMBERS} members` };
  }

  const userRes = await db.query(`select "id" from "user" where "email" = $1`, [normalized]);
  let inserted;
  try {
    inserted = await db.query(
      `insert into team_members (team_id, email, user_id)
       values ($1, $2, $3)
       on conflict (team_id, email) do nothing
       returning id`,
      [teamId, normalized, userRes.rows[0]?.id ?? null]
    );
  } catch (error) {
    // Concurrent add to another team — the unique index has the final say
    if ((error as { code?: string }).code === "23505") {
      return { error: "This email is already a member of another team" };
    }
    throw error;
  }

  if (inserted.rows.length > 0) {
    await sendInviteMagicLink(normalized);
  }

  revalidatePath("/dashboard/teams");
  return { success: true };
}

export async function removeTeamMember(teamId: string, memberId: string) {
  const { team } = await requireOwnedTeam(teamId);

  const memberRes = await db.query(
    `select email, user_id from team_members where id = $1 and team_id = $2`,
    [memberId, teamId]
  );
  const member = memberRes.rows[0];
  if (!member) {
    return { error: "Member not found" };
  }

  await db.query(`delete from team_members where id = $1 and team_id = $2`, [memberId, teamId]);
  await cleanupMember(team.owner_user_id, member.email, member.user_id, teamId);

  revalidatePath("/dashboard/teams");
  return { success: true };
}

export async function deleteTeam(teamId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const { team } = await requireOwnedTeam(teamId);

    await deleteTeamAndCleanup(teamId, team.owner_user_id);

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Team deletion failed:", error);
    return { error: error instanceof Error ? error.message : "Could not delete the team" };
  }
}
