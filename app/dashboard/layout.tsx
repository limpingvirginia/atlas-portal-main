import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowUp as ArrowUpCircle
} from "@hugeicons/core-free-icons";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { claimPurchases, getPurchases, isTeamMember } from "@/lib/account";
import { products, TEAM_PRODUCT_IDS } from "@/lib/products";
import { Navbar } from "@/components/layout/landing/navbar";
import { Button } from "@/components/ui/button";
import PaddleCheckout from "@/components/paddle-checkout";
import DashboardNav from "./components/dashboard-nav";

export const metadata = {
  title: "Dashboard | Shadcn UI Dashboard"
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/?login=1");
  }

  await claimPurchases(session.user.id, session.user.email);

  // Pro license owners without a team can upgrade by paying the difference
  const purchases = await getPurchases(session.user.id);
  const canUpgrade =
    purchases.some((p) => p.product_id === "nextjs-starter" && p.status === "completed") &&
    !purchases.some((p) => TEAM_PRODUCT_IDS.includes(p.product_id) && p.status === "completed");
  const upgrade = products.find((p) => p.id === "nextjs-upgrade");

  // Pure team members (no purchases of their own) don't see Payments
  const memberOnly =
    purchases.length === 0 && (await isTeamMember(session.user.id, session.user.email));

  return (
    <>
      <Navbar initialUser={session.user} />
      <div className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl">My Account</h1>
            <p className="text-muted-foreground text-sm">{session.user.email}</p>
          </div>
          {canUpgrade && (
            <PaddleCheckout product_key="nextjs-upgrade">
              <Button>
                <HugeiconsIcon icon={ArrowUpCircle} className="size-4" />
                Upgrade to Premium ({upgrade?.price})
              </Button>
            </PaddleCheckout>
          )}
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <DashboardNav showPayments={!memberOnly} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
