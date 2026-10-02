"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/products";
import {
  GITHUB_USERNAME_REGEX,
  githubUserExists,
  inviteCollaborator,
  isCollaborator
} from "@/lib/github";

export async function requestGithubAccess(purchaseId: string, username: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "You must be signed in to request GitHub access." };
  }

  const githubUsername = username.trim();
  if (!GITHUB_USERNAME_REGEX.test(githubUsername)) {
    return { error: "Enter a valid GitHub username." };
  }

  // The purchase must belong to the signed-in user, or to the owner of a
  // team the user is a member of (members manage their own repo access)
  const purchaseRes = await db.query(
    `select p.id, p.product_id from purchases p
     where p.id = $1 and (
       p.user_id = $2
       or (p.status = 'completed' and p.user_id in (
         select t.owner_user_id from teams t
         join team_members m on m.team_id = t.id
         where m.user_id = $2 or m.email = $3
       ))
     )`,
    [purchaseId, session.user.id, session.user.email]
  );
  const purchase = purchaseRes.rows[0];
  if (!purchase) {
    return { error: "Purchase not found." };
  }

  const product = products.find((p) => p.id === purchase.product_id);
  if (!product?.github_repo) {
    return { error: "This product has no repository yet." };
  }

  const status = await inviteCollaborator(product.github_repo, githubUsername);

  if (status === 404) {
    // GitHub returns 404 both for an unknown user and for an inaccessible
    // repository — distinguish so the customer gets an accurate message
    if (!(await githubUserExists(githubUsername))) {
      return { error: `GitHub user "${githubUsername}" was not found.` };
    }
    console.error(`GitHub invite failed: repository ${product.github_repo} is not accessible`);
    return {
      error: "The access service is temporarily unavailable. Please try again later or contact support."
    };
  }
  if (status !== 201 && status !== 204) {
    return { error: "Something went wrong. Please try again later." };
  }

  // 204 can mean the user already accepted an earlier invitation
  const active = status === 204 && (await isCollaborator(product.github_repo, githubUsername));

  await db.query(
    `insert into github_access (purchase_id, user_id, github_username, status)
     values ($1, $2, $3, $4)
     on conflict (purchase_id, user_id)
     do update set github_username = excluded.github_username, status = excluded.status`,
    [purchaseId, session.user.id, githubUsername, active ? "active" : "pending"]
  );

  revalidatePath("/dashboard");
  return {
    success: true,
    message:
      status === 201
        ? `Invitation sent to @${githubUsername}! Accept it from your GitHub notifications or email.`
        : active
          ? `@${githubUsername} already has access to the repository.`
          : `@${githubUsername} already has a pending invitation.`
  };
}
