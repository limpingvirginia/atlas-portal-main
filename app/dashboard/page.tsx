import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package
} from "@hugeicons/core-free-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getEffectivePurchases } from "@/lib/account";
import { db } from "@/lib/db";
import { products, TEAM_PRODUCT_IDS } from "@/lib/products";
import { hasPendingInvitation, isCollaborator } from "@/lib/github";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GithubAccessDialog from "./components/github-access-dialog";
import DownloadButton from "./components/download-button";
import GithubIcon from "./components/github-icon";
import GettingStartedTimeline from "./components/getting-started-timeline";

export default async function ProductsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  let purchases = await getEffectivePurchases(session!.user.id, session!.user.email);

  // Sync this user's access state with GitHub: invitations may have been
  // accepted or cancelled, and collaborator access may have been revoked
  const withAccess = purchases.filter((p) => p.github_status && p.github_username);
  if (withAccess.length > 0) {
    let refreshed = false;
    for (const purchase of withAccess) {
      const repo = products.find((p) => p.id === purchase.product_id)?.github_repo;
      if (!repo) continue;

      const collaborator = await isCollaborator(repo, purchase.github_username!);

      if (purchase.github_status === "pending" && collaborator) {
        await db.query(
          `update github_access set status = 'active' where purchase_id = $1 and user_id = $2`,
          [purchase.id, session!.user.id]
        );
        refreshed = true;
      } else if (!collaborator) {
        // Active access revoked, or a pending invitation cancelled/declined —
        // reset so the customer can request access again
        const stillInvited =
          purchase.github_status === "pending" &&
          (await hasPendingInvitation(repo, purchase.github_username!));
        if (!stillInvited) {
          await db.query(
            `delete from github_access where purchase_id = $1 and user_id = $2`,
            [purchase.id, session!.user.id]
          );
          refreshed = true;
        }
      }
    }
    if (refreshed) purchases = await getEffectivePurchases(session!.user.id, session!.user.email);
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <HugeiconsIcon icon={Package} className="text-muted-foreground size-10" />
          <div>
            <p className="mb-1 font-medium">You don&apos;t have any products yet</p>
            <p className="text-muted-foreground text-sm">
              Products you purchase will appear here.
            </p>
          </div>
          <Button asChild>
            <Link href="/pricing">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg">Products</h2>
        <p className="text-muted-foreground text-sm">
          Get the source code of your purchased templates via GitHub or as a direct download.
        </p>
      </div>

      <GettingStartedTimeline purchase={purchases[0]} />

      <div className={purchases.length > 1 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>
        {purchases.map((purchase) => {
          const product = products.find((p) => p.id === purchase.product_id);
          // The upgrade purchase represents the resulting Premium license — the
          // "Upgrade" wording only belongs in the payment history
          const displayName =
            purchase.product_id === "nextjs-upgrade"
              ? (products.find((p) => p.id === "nextjs-extended")?.title ?? purchase.product_name)
              : purchase.product_name;
          return (
            <Card key={purchase.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{displayName}</CardTitle>
                  <div className="flex items-center gap-1.5">
                  {purchase.via_team && <Badge variant="outline">via Team</Badge>}
                  {purchase.github_status === "active" ? (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Active
                    </Badge>
                  ) : purchase.github_status === "pending" ? (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      Pending
                    </Badge>
                  ) : null}
                  </div>
                </div>
                <CardDescription>
                  Purchased: {new Date(purchase.created_at).toLocaleDateString("en-US")}
                  {purchase.github_username ? ` · @${purchase.github_username}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product?.github_repo && (
                    <>
                      {purchase.github_status === "pending" ? (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`https://github.com/${product.github_repo}/invitations`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <GithubIcon />
                            Accept Invitation
                          </a>
                        </Button>
                      ) : purchase.github_status === "active" ? (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`https://github.com/${product.github_repo}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <GithubIcon />
                            View Repository
                          </a>
                        </Button>
                      ) : (
                        <GithubAccessDialog
                          purchaseId={purchase.id}
                          currentUsername={purchase.github_username}
                        />
                      )}
                      <DownloadButton
                        purchaseId={purchase.id}
                        filename={`${product.github_repo.split("/")[1]}.zip`}
                      />
                    </>
                  )}
                  {TEAM_PRODUCT_IDS.includes(purchase.product_id) && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/teams">Manage Team</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
