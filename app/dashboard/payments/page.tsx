import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCard
} from "@hugeicons/core-free-icons";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPurchases, isTeamMember } from "@/lib/account";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

function formatAmount(cents: number | null, currency: string | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD"
  }).format(cents / 100);
}

export default async function PaymentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const purchases = await getPurchases(session!.user.id);

  // Pure team members don't have payments of their own — page is hidden for them
  if (purchases.length === 0 && (await isTeamMember(session!.user.id, session!.user.email))) {
    redirect("/dashboard");
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <HugeiconsIcon icon={CreditCard} className="text-muted-foreground size-10" />
          <div>
            <p className="mb-1 font-medium">No payments yet</p>
            <p className="text-muted-foreground text-sm">
              Your purchases will be listed here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg">Payments</h2>
        <p className="text-muted-foreground text-sm">
          Your purchase history. Keep the transaction id handy when contacting support.
        </p>
      </div>
      <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{new Date(purchase.created_at).toLocaleDateString("en-US")}</TableCell>
                <TableCell className="font-medium">{purchase.product_name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {purchase.paddle_transaction_id}
                </TableCell>
                <TableCell>
                  {purchase.status === "upgraded" ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Upgraded
                    </Badge>
                  ) : purchase.status === "refunded" ? (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Refunded
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {purchase.status === "completed" ? "Completed" : purchase.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(purchase.amount_cents, purchase.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      </Card>
    </div>
  );
}
