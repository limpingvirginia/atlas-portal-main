"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateLicenseKey, MAX_LICENSES } from "@/lib/license";
import { hasCompletedPurchase } from "@/lib/account";

export async function createLicense(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  if (!(await hasCompletedPurchase(session.user.id, session.user.email))) {
    return { error: "License keys become available after you purchase a product." };
  }

  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 50) {
    return { error: "Enter a name between 1 and 50 characters" };
  }

  const countRes = await db.query(`select count(*)::int as count from licenses where user_id = $1`, [
    session.user.id
  ]);
  if (countRes.rows[0].count >= MAX_LICENSES) {
    return { error: `You can create up to ${MAX_LICENSES} license keys` };
  }

  await db.query(
    `insert into licenses (name, license_key, user_id) values ($1, $2, $3)`,
    [trimmed, generateLicenseKey(), session.user.id]
  );

  revalidatePath("/dashboard/licenses");
  return { success: true };
}

export async function deleteLicense(licenseId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  await db.query(`delete from licenses where id = $1 and user_id = $2`, [
    licenseId,
    session.user.id
  ]);

  revalidatePath("/dashboard/licenses");
  return { success: true };
}
