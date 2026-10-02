import "server-only";
import { db } from "@/lib/db";
import { TEAM_PRODUCT_IDS } from "@/lib/products";

export const MAX_TEAM_MEMBERS = 20;
export const MAX_TEAMS = 3;

export interface Purchase {
  id: string;
  paddle_transaction_id: string;
  product_id: string;
  product_name: string | null;
  amount_cents: number | null;
  currency: string | null;
  status: string;
  created_at: Date;
  /** True when the purchase belongs to the user's team owner, not the user */
  via_team: boolean;
  github_username: string | null;
  github_status: "pending" | "active" | null;
}

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  created_at: Date;
}

export interface Team {
  id: string;
  name: string;
  owner_user_id: string | null;
  owner_email: string | null;
  created_at: Date;
  members: TeamMember[];
}

/**
 * Purchases are recorded by the Paddle webhook before the customer may have an
 * account. On every dashboard visit, attach any unclaimed rows matching the
 * signed-in user's email to their user id.
 */
export async function claimPurchases(userId: string, email: string) {
  await db.query(
    `update purchases set user_id = $1 where user_id is null and customer_email = $2`,
    [userId, email]
  );
  await db.query(
    `update teams set owner_user_id = $1 where owner_user_id is null and owner_email = $2`,
    [userId, email]
  );
  await db.query(
    `update team_members set user_id = $1 where user_id is null and email = $2`,
    [userId, email]
  );
}

/** The user's own purchases (Payments page, upgrade eligibility). */
export async function getPurchases(userId: string): Promise<Purchase[]> {
  const res = await db.query(
    `select p.id, p.paddle_transaction_id, p.product_id, p.product_name, p.amount_cents,
            p.currency, p.status, p.created_at, false as via_team,
            g.github_username, g.status as github_status
     from purchases p
     left join github_access g on g.purchase_id = p.id and g.user_id = $1
     where p.user_id = $1 order by p.created_at desc`,
    [userId]
  );
  return res.rows;
}

/**
 * Own purchases plus the team owner's completed purchases when the user is a
 * team member. Only completed purchases grant products — an 'upgraded' single
 * license is superseded by its team upgrade and stays visible only in the
 * payment history. GitHub access is joined per requesting user, so every
 * member manages their own repository access.
 */
export async function getEffectivePurchases(userId: string, email: string): Promise<Purchase[]> {
  const res = await db.query(
    `select p.id, p.paddle_transaction_id, p.product_id, p.product_name, p.amount_cents,
            p.currency, p.status, p.created_at,
            (p.user_id is distinct from $1) as via_team,
            g.github_username, g.status as github_status
     from purchases p
     left join github_access g on g.purchase_id = p.id and g.user_id = $1
     where (p.user_id = $1 and p.status = 'completed')
        or (p.status = 'completed' and p.user_id in (
             select t.owner_user_id from teams t
             join team_members m on m.team_id = t.id
             where (m.user_id = $1 or m.email = $2) and t.owner_user_id is not null
           ))
     order by p.created_at desc`,
    [userId, email]
  );
  return res.rows;
}

/**
 * Whether the user can create a(nother) team: requires a completed
 * team-granting purchase and fewer than MAX_TEAMS owned teams.
 */
export async function getTeamEntitlement(userId: string): Promise<{ purchaseId: string } | null> {
  const purchaseRes = await db.query(
    `select p.id from purchases p
     where p.user_id = $1 and p.status = 'completed' and p.product_id = any($2)
     order by p.created_at asc limit 1`,
    [userId, TEAM_PRODUCT_IDS]
  );
  if (!purchaseRes.rows[0]) return null;

  const countRes = await db.query(
    `select count(*)::int as count from teams where owner_user_id = $1`,
    [userId]
  );
  if (countRes.rows[0].count >= MAX_TEAMS) return null;

  return { purchaseId: purchaseRes.rows[0].id };
}

/** True when the user belongs to someone else's team. */
export async function isTeamMember(userId: string, email: string): Promise<boolean> {
  const res = await db.query(
    `select 1 from team_members where user_id = $1 or email = $2 limit 1`,
    [userId, email]
  );
  return res.rows.length > 0;
}

/**
 * Whether the user owns a completed purchase — directly, or via a team whose
 * owner has one. Gates license key creation.
 */
export async function hasCompletedPurchase(userId: string, email: string): Promise<boolean> {
  const res = await db.query(
    `select 1 from purchases p
     where p.status = 'completed'
       and (p.user_id = $1
         or p.user_id in (
           select t.owner_user_id from teams t
           join team_members m on m.team_id = t.id
           where (m.user_id = $1 or m.email = $2) and t.owner_user_id is not null
         ))
     limit 1`,
    [userId, email]
  );
  return res.rows.length > 0;
}

export interface License {
  id: string;
  name: string;
  license_key: string;
  created_at: Date;
}

/** License keys are user-scoped CLI credentials, independent from purchases. */
export async function getLicenses(userId: string): Promise<License[]> {
  const res = await db.query(
    `select id, name, license_key, created_at
     from licenses where user_id = $1 order by created_at desc`,
    [userId]
  );
  return res.rows;
}

/** Teams the user owns, or is a member of (matched by user id or email). */
export async function getTeams(userId: string, email: string): Promise<Team[]> {
  const teamsRes = await db.query(
    `select distinct t.id, t.name, t.owner_user_id, t.owner_email, t.created_at
     from teams t
     left join team_members m on m.team_id = t.id
     where t.owner_user_id = $1 or m.user_id = $1 or m.email = $2
     order by t.created_at desc`,
    [userId, email]
  );

  const teams: Team[] = [];
  for (const row of teamsRes.rows) {
    const membersRes = await db.query(
      `select id, email, role, created_at from team_members
       where team_id = $1 order by created_at asc`,
      [row.id]
    );
    teams.push({ ...row, members: membersRes.rows });
  }
  return teams;
}
