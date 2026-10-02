import { HugeiconsIcon } from "@hugeicons/react";
import {
  Users,
  CircleArrowUp as ArrowUpCircle
} from "@hugeicons/core-free-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  getPurchases,
  getTeams,
  getTeamEntitlement,
  MAX_TEAM_MEMBERS,
  MAX_TEAMS
} from "@/lib/account";
import { products, TEAM_PRODUCT_IDS } from "@/lib/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TeamMembers from "./team-members";
import DeleteTeamButton from "./delete-team-button";
import CreateTeamDialog from "./create-team-dialog";
import PaddleCheckout from "@/components/paddle-checkout";

export default async function TeamsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const teams = await getTeams(session!.user.id, session!.user.email);

  if (teams.length === 0) {
    // A team license without a team yet — the owner creates it here
    const entitlement = await getTeamEntitlement(session!.user.id);
    if (entitlement) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <HugeiconsIcon icon={Users} className="text-muted-foreground size-10" />
            <div>
              <p className="mb-1 font-medium">No team yet</p>
              <p className="text-muted-foreground text-sm">
                Create your team to share your products with up to {MAX_TEAM_MEMBERS} members.
              </p>
            </div>
            <CreateTeamDialog maxMembers={MAX_TEAM_MEMBERS} />
          </CardContent>
        </Card>
      );
    }

    const purchases = await getPurchases(session!.user.id);
    const canUpgrade =
      purchases.some((p) => p.product_id === "nextjs-starter" && p.status === "completed") &&
      !purchases.some((p) => TEAM_PRODUCT_IDS.includes(p.product_id) && p.status === "completed");
    const upgrade = products.find((p) => p.id === "nextjs-upgrade");

    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <HugeiconsIcon icon={Users} className="text-muted-foreground size-10" />
          <div>
            <p className="mb-1 font-medium">No team license</p>
            <p className="text-muted-foreground text-sm">
              {canUpgrade
                ? `Upgrade your Pro license to a Premium license by paying only the difference (${upgrade?.price}), and manage your team members here.`
                : "When you purchase a Premium license, you can manage your team members here."}
            </p>
          </div>
          {canUpgrade ? (
            <PaddleCheckout product_key="nextjs-upgrade">
              <Button>
                <HugeiconsIcon icon={ArrowUpCircle} className="size-4" />
                Upgrade to Premium ({upgrade?.price})
              </Button>
            </PaddleCheckout>
          ) : (
            <Button asChild>
              <Link href="/pricing">Get Premium License</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const entitlement = await getTeamEntitlement(session!.user.id);
  const ownedTeamsCount = teams.filter(
    (t) => t.owner_user_id === session!.user.id || t.owner_email === session!.user.email
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg">Teams</h2>
          <p className="text-muted-foreground text-sm">
            Members sign in with a one-click email link and get access to all your products.
            {ownedTeamsCount > 0 ? ` ${ownedTeamsCount}/${MAX_TEAMS} teams created.` : ""}
          </p>
        </div>
        {entitlement && <CreateTeamDialog maxMembers={MAX_TEAM_MEMBERS} />}
      </div>
      {teams.map((team) => {
        const isOwner =
          team.owner_user_id === session!.user.id || team.owner_email === session!.user.email;
        return (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{team.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{isOwner ? "Owner" : "Member"}</Badge>
                  {isOwner && <DeleteTeamButton teamId={team.id} />}
                </div>
              </div>
              <CardDescription>
                {team.members.length}/{MAX_TEAM_MEMBERS} members · Created:{" "}
                {new Date(team.created_at).toLocaleDateString("en-US")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembers
                teamId={team.id}
                ownerEmail={team.owner_email}
                members={team.members}
                canManage={isOwner}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
