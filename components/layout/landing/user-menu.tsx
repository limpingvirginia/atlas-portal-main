"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  LayoutDashboard,
  LogOut
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";
import { useLoginDialogStore } from "@/store/login-dialog-store";

/** Session user snapshot rendered on the server for an instant first paint. */
export type InitialUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export default function UserMenu({ initialUser }: { initialUser?: InitialUser }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const openLoginDialog = useLoginDialogStore((state) => state.setOpen);

  // Until the client session resolves, trust the server-rendered value so the
  // menu doesn't pop in after page load
  const user = isPending ? initialUser : session?.user;

  if (isPending && initialUser === undefined) {
    return <div className="size-8" />;
  }

  if (!user) {
    return (
      <Button size="lg" variant="ghost" onClick={() => openLoginDialog(true)}>
        Sign In
      </Button>
    );
  }

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none">
        <Avatar className="size-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate font-medium">{user.name}</div>
          <div className="text-muted-foreground truncate text-xs font-normal">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <HugeiconsIcon icon={LayoutDashboard} className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => router.push("/")
              }
            })
          }>
          <HugeiconsIcon icon={LogOut} className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
