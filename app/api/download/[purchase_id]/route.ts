import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/products";
import { githubApiHeaders } from "@/lib/github";

/** Streams the product's GitHub repository as a zip to the purchase owner. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ purchase_id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { purchase_id } = await params;
  // Own purchase, or the team owner's purchase when the user is a member
  const purchaseRes = await db.query(
    `select p.product_id from purchases p
     where p.id = $1 and (
       p.user_id = $2
       or (p.status = 'completed' and p.user_id in (
         select t.owner_user_id from teams t
         join team_members m on m.team_id = t.id
         where m.user_id = $2 or m.email = $3
       ))
     )`,
    [purchase_id, session.user.id, session.user.email]
  );
  const purchase = purchaseRes.rows[0];
  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  const product = products.find((p) => p.id === purchase.product_id);
  if (!product?.github_repo) {
    return NextResponse.json({ error: "This product has no repository yet" }, { status: 404 });
  }

  // Explain the actual reason instead of a generic failure (per-user access)
  const accessRes = await db.query(
    `select status from github_access where purchase_id = $1 and user_id = $2`,
    [purchase_id, session.user.id]
  );
  const accessStatus: string | undefined = accessRes.rows[0]?.status;
  if (!accessStatus) {
    return NextResponse.json(
      {
        error:
          "You haven't requested GitHub access yet. Click the GitHub Access button, enter your GitHub username, then try downloading again."
      },
      { status: 403 }
    );
  }
  if (accessStatus !== "active") {
    return NextResponse.json(
      {
        error:
          "Your GitHub invitation is still pending. Accept the invitation from your GitHub notifications or email, then try again."
      },
      { status: 403 }
    );
  }

  const res = await fetch(`https://api.github.com/repos/${product.github_repo}/zipball`, {
    headers: githubApiHeaders()
  });
  if (!res.ok || !res.body) {
    console.error("GitHub zipball error:", res.status, await res.text());
    return NextResponse.json(
      { error: "The download service is temporarily unavailable. Please try again later." },
      { status: 502 }
    );
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product.github_repo.split("/")[1]}.zip"`
    }
  });
}
