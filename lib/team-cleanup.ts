import "server-only";
import { db } from "@/lib/db";
import { products } from "@/lib/products";
import { revokeRepoAccess } from "@/lib/github";

/**
 * Cleans up everything a member gained through the team: GitHub repository
 * access granted on the owner's purchases, and — when the account exists
 * purely through this team — the account itself, which cascades their
 * licenses, sessions and remaining rows.
 */
export async function cleanupMember(
  ownerUserId: string | null,
  memberEmail: string,
  memberUserId: string | null,
  teamId: string
) {
  const userId =
    memberUserId ??
    (await db.query(`select "id" from "user" where "email" = $1`, [memberEmail])).rows[0]?.id ??
    null;

  if (!userId) return;

  // Revoke GitHub access obtained via the owner's purchases
  const accessRes = await db.query(
    `select g.id, g.github_username, p.product_id
     from github_access g
     join purchases p on p.id = g.purchase_id
     where p.user_id = $1 and g.user_id = $2`,
    [ownerUserId, userId]
  );
  for (const row of accessRes.rows) {
    const repo = products.find((p) => p.id === row.product_id)?.github_repo;
    if (repo) {
      try {
        await revokeRepoAccess(repo, row.github_username);
      } catch (error) {
        console.error(`Failed to revoke GitHub access for ${row.github_username}:`, error);
      }
    }
    await db.query(`delete from github_access where id = $1`, [row.id]);
  }

  // Delete the account only when it exists purely through this team — a
  // paying customer, or a member of another team, must never lose their data
  const ownPurchases = await db.query(
    `select count(*)::int as count from purchases where user_id = $1`,
    [userId]
  );
  if (ownPurchases.rows[0].count > 0) return;

  const otherMemberships = await db.query(
    `select 1 from team_members where (user_id = $1 or email = $2) and team_id <> $3 limit 1`,
    [userId, memberEmail, teamId]
  );
  if (otherMemberships.rows.length > 0) return;

  await db.query(`delete from "user" where "id" = $1`, [userId]);
}

/** Deletes a team after revoking every member's team-based access. */
export async function deleteTeamAndCleanup(teamId: string, ownerUserId: string | null) {
  const membersRes = await db.query(
    `select email, user_id from team_members where team_id = $1`,
    [teamId]
  );

  for (const member of membersRes.rows) {
    await cleanupMember(ownerUserId, member.email, member.user_id, teamId);
  }

  // Cascades the remaining team_members rows; the owner's purchase stays,
  // so a new team can be created later
  await db.query(`delete from teams where id = $1`, [teamId]);
}
