"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package,
  KeyRound,
  Users,
  CreditCard
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Products", icon: Package },
  { href: "/dashboard/licenses", label: "Licenses", icon: KeyRound },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard }
];

export default function DashboardNav({ showPayments = true }: { showPayments?: boolean }) {
  const pathname = usePathname();
  const visibleLinks = showPayments
    ? links
    : links.filter((link) => link.href !== "/dashboard/payments");

  return (
    <nav className="flex gap-1 overflow-x-auto lg:w-56 lg:flex-col">
      {visibleLinks.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            pathname === href
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}>
          <HugeiconsIcon icon={icon} className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
