import { HugeiconsIcon } from "@hugeicons/react";
import {
  KeyRound
} from "@hugeicons/core-free-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLicenses, hasCompletedPurchase } from "@/lib/account";
import { MAX_LICENSES } from "@/lib/license";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CopyButton from "../components/copy-button";
import CreateLicenseDialog from "./create-license-dialog";
import DeleteLicenseButton from "./delete-license-button";

export default async function LicensesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const licenses = await getLicenses(session!.user.id);

  if (licenses.length === 0) {
    const entitled = await hasCompletedPurchase(session!.user.id, session!.user.email);
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <HugeiconsIcon icon={KeyRound} className="text-muted-foreground size-10" />
          <div>
            <p className="mb-1 font-medium">No license keys yet</p>
            <p className="text-muted-foreground text-sm">
              {entitled
                ? "License keys authenticate the shadcn CLI when downloading premium components."
                : "License keys become available after you purchase a product."}
            </p>
          </div>
          {entitled ? (
            <CreateLicenseDialog />
          ) : (
            <Button asChild>
              <Link href="/pricing">Browse Products</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg">License Keys</h2>
          <p className="text-muted-foreground text-sm">
            License keys authenticate the shadcn CLI when installing premium components.{" "}
            {licenses.length}/{MAX_LICENSES} created.
          </p>
        </div>
        <CreateLicenseDialog disabled={licenses.length >= MAX_LICENSES} />
      </div>

      {licenses.map((license) => (
        <Card key={license.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{license.name}</CardTitle>
              <DeleteLicenseButton licenseId={license.id} />
            </div>
            <CardDescription>
              Created: {new Date(license.created_at).toLocaleDateString("en-US")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="bg-muted flex-1 overflow-x-auto rounded-lg px-3 py-2 font-mono text-sm">
                {license.license_key}
              </code>
              <CopyButton value={license.license_key} />
            </div>
            <p className="text-muted-foreground text-xs">
              Use this key when installing components via the CLI:{" "}
              <code className="bg-muted rounded px-1 py-0.5">
                npx shadcn@latest add &lt;component&gt; --license {license.license_key}
              </code>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
