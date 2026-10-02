import "server-only";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { products } from "@/lib/products";
import { hasCompletedPurchase } from "@/lib/account";
import { deleteTeamAndCleanup } from "@/lib/team-cleanup";
import { revokeRepoAccess } from "@/lib/github";
import { sendMail } from "@/lib/mail";

export const PADDLE_API_BASE = {
  production: "https://api.paddle.com",
  sandbox: "https://sandbox-api.paddle.com"
} as const;

export function paddleEnv() {
  return process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";
}

// Side effects after the purchase is committed (mails, push) must never fail
// the caller — a webhook failure makes Paddle retry and we'd double-process.
const safe = async (label: string, fn: () => Promise<unknown>) => {
  try {
    await fn();
  } catch (error) {
    console.error(`Purchase side effect failed (${label}):`, error);
  }
};

async function fetchCustomerEmail(customerId: string): Promise<string | null> {
  const res = await fetch(`${PADDLE_API_BASE[paddleEnv()]}/customers/${customerId}`, {
    headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` }
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.email ?? null;
}

/**
 * Records a completed Paddle transaction: purchase row, team (for team
 * licenses) and notifications. Idempotent — a transaction that was already
 * processed (webhook retry, confirm + webhook race) is a no-op.
 *
 * `data` is the raw Paddle transaction object (snake_case), either from a
 * webhook event or fetched from the Paddle API.
 */
export async function processCompletedTransaction(data: {
  id: string;
  customer_id?: string | null;
  currency_code?: string;
  custom_data?: { app_product_id?: string; app_user_id?: string } | null;
  details?: { totals?: { total?: string } };
}): Promise<{ processed: boolean }> {
  const product = products.find((p) => p.id === data?.custom_data?.app_product_id);
  if (!product) {
    // Not a purchase created by this app
    return { processed: false };
  }

  const customerEmail = data.customer_id ? await fetchCustomerEmail(data.customer_id) : null;
  const totalCents = parseInt(data?.details?.totals?.total ?? "0", 10);
  const currency = data?.currency_code ?? product.currency_code;
  let inserted = false;
  let isNewUser = false;

  const client = await db.connect();
  try {
    await client.query("begin");

    // Link to the signed-in account that started the checkout (custom_data),
    // falling back to an email match against registered users
    const customUserId = data?.custom_data?.app_user_id;
    let userId: string | null = null;
    if (customUserId) {
      const byId = await client.query(`select "id" from "user" where "id" = $1`, [customUserId]);
      userId = byId.rows[0]?.id ?? null;
    }
    if (!userId && customerEmail) {
      const byEmail = await client.query(`select "id" from "user" where "email" = $1`, [
        customerEmail
      ]);
      userId = byEmail.rows[0]?.id ?? null;

      // No account yet — create one so the purchase is attached immediately.
      // The customer signs in later via magic link, Google or GitHub with the
      // same email; email is treated as verified since they paid with it.
      if (!userId) {
        const name = customerEmail.split("@")[0];
        const newUser = await client.query(
          `insert into "user" ("id", "name", "email", "emailVerified")
           values ($1, $2, $3, true)
           on conflict ("email") do nothing
           returning "id"`,
          [crypto.randomUUID().replace(/-/g, ""), name, customerEmail]
        );
        userId = newUser.rows[0]?.id ?? null;
        isNewUser = userId !== null;
      }
    }

    const purchaseRes = await client.query(
      `insert into purchases
         (paddle_transaction_id, product_id, product_name, amount_cents, currency, status, customer_email, user_id)
       values ($1, $2, $3, $4, $5, 'completed', $6, $7)
       on conflict (paddle_transaction_id) do nothing
       returning id`,
      [data.id, product.id, product.title, totalCents, currency, customerEmail, userId]
    );

    if (purchaseRes.rows.length > 0) {
      inserted = true;

      // License keys are NOT auto-created — the customer generates them
      // from the Licenses section of the dashboard when needed.

      // Team-granting purchases don't auto-create a team — the owner creates
      // it from the dashboard with a name and initial members.

      // An upgrade replaces the single license — mark it so the history is
      // clear, and carry existing GitHub access over to the new purchase so
      // the customer doesn't have to request it again
      if (product.id === "nextjs-upgrade" && userId) {
        const upgraded = await client.query(
          `update purchases set status = 'upgraded'
           where user_id = $1 and product_id = 'nextjs-starter' and status = 'completed'
           returning id`,
          [userId]
        );
        const starterIds = upgraded.rows.map((row) => row.id);
        if (starterIds.length > 0) {
          await client.query(
            `insert into github_access (purchase_id, user_id, github_username, status)
             select $1, user_id, github_username, status from github_access
             where purchase_id = any($2::uuid[])
             on conflict (purchase_id, user_id) do nothing`,
            [purchaseRes.rows[0].id, starterIds]
          );
          await client.query(`delete from github_access where purchase_id = any($1::uuid[])`, [
            starterIds
          ]);
        }
      }
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  if (inserted) {
    const price = `$${(totalCents / 100).toFixed(2)}`;

    if (customerEmail) {
      if (isNewUser) {
        // Account was just created from this purchase — send a one-click
        // sign-in link (magic link) instead of a plain confirmation
        await safe("magic-link", () =>
          auth.api.signInMagicLink({
            body: { email: customerEmail, callbackURL: "/dashboard" },
            headers: new Headers()
          })
        );
      } else {
        // Existing account — purchase confirmation with a dashboard button
        await safe("license-mail", () =>
          sendMail({
            template: "license",
            from: "Thanks - Shadcn UI Dashboard 🎉",
            to: customerEmail,
            subject: "Your purchase is confirmed",
            data: { productName: product.title }
          })
        );
      }
    }

    // New sale notification to the site owner
    const ownerEmail = process.env.SALE_NOTIFICATION_EMAIL;
    if (ownerEmail) {
      await safe("new-sale-mail", () =>
        sendMail({
          template: "new-sale",
          from: `New Sale - ${product.title} 🎉`,
          to: ownerEmail,
          subject: "Congratulations 🎉",
          data: { customerEmail: customerEmail ?? "unknown", productName: product.title, price }
        })
      );
    }

    // Mobile push notification
    if (process.env.PUSHOVER_TOKEN && process.env.PUSHOVER_USER) {
      await safe("pushover", () =>
        fetch("https://api.pushover.net/1/messages.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: process.env.PUSHOVER_TOKEN,
            user: process.env.PUSHOVER_USER,
            message: `${product.title} - ${price}`,
            sound: "vdfv"
          })
        })
      );
    }
  }

  return { processed: inserted };
}

/**
 * Reverts a refunded or charged-back transaction: marks the purchase, deletes
 * teams it granted (revoking every member's team-based access), revokes GitHub
 * repository access and drops license keys the customer is no longer entitled
 * to. A refunded upgrade restores the single license it had replaced.
 * Idempotent — an already-refunded purchase is a no-op.
 */
export async function processRefundedTransaction(
  transactionId: string
): Promise<{ processed: boolean }> {
  const purchaseRes = await db.query(
    `select id, product_id, user_id from purchases
     where paddle_transaction_id = $1 and status <> 'refunded'`,
    [transactionId]
  );
  const purchase = purchaseRes.rows[0];
  if (!purchase) return { processed: false };

  await db.query(`update purchases set status = 'refunded' where id = $1`, [purchase.id]);

  // Teams granted by this purchase disappear with it
  const teamsRes = await db.query(`select id, owner_user_id from teams where purchase_id = $1`, [
    purchase.id
  ]);
  for (const team of teamsRes.rows) {
    await deleteTeamAndCleanup(team.id, team.owner_user_id);
  }

  // A refunded upgrade restores the single license it replaced — the owner's
  // repo access moves back with it instead of being revoked
  if (purchase.product_id === "nextjs-upgrade" && purchase.user_id) {
    const restored = await db.query(
      `update purchases set status = 'completed'
       where user_id = $1 and product_id = 'nextjs-starter' and status = 'upgraded'
       returning id`,
      [purchase.user_id]
    );
    if (restored.rows[0]) {
      await db.query(
        `update github_access set purchase_id = $1 where purchase_id = $2 and user_id = $3`,
        [restored.rows[0].id, purchase.id, purchase.user_id]
      );
    }
  }

  // Revoke whatever GitHub access is still tied to the refunded purchase
  const repo = products.find((p) => p.id === purchase.product_id)?.github_repo;
  const accessRes = await db.query(
    `select id, github_username from github_access where purchase_id = $1`,
    [purchase.id]
  );
  for (const row of accessRes.rows) {
    if (repo) {
      try {
        await revokeRepoAccess(repo, row.github_username);
      } catch (error) {
        console.error(`Failed to revoke GitHub access for ${row.github_username}:`, error);
      }
    }
    await db.query(`delete from github_access where id = $1`, [row.id]);
  }

  // License keys require a completed purchase — drop them if this was the last
  if (purchase.user_id) {
    const userRes = await db.query(`select "email" from "user" where "id" = $1`, [
      purchase.user_id
    ]);
    const email = userRes.rows[0]?.email;
    if (email && !(await hasCompletedPurchase(purchase.user_id, email))) {
      await db.query(`delete from licenses where user_id = $1`, [purchase.user_id]);
    }
  }

  return { processed: true };
}
