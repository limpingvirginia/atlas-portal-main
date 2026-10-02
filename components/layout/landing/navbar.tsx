"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  LayoutDashboard,
  Menu,
  MoonIcon,
  SunIcon
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/layout/logo";
import UserMenu, { type InitialUser } from "@/components/layout/landing/user-menu";
import LoginDialog from "@/components/layout/landing/login-dialog";
import ThanksDialog from "@/components/layout/landing/thanks-dialog";
import { Fragment, useState } from "react";

interface RouteProps {
  href: string;
  label: string;
  items?: {
    href: string;
    label: string;
    description?: string;
    isComing?: boolean;
  }[];
}

export const routeList: RouteProps[] = [
  {
    href: "/ecommerce",
    label: "Dashboard Preview"
  },
  {
    href: "/blocks",
    label: "Blocks"
  },
  {
    href: "/styles",
    label: "Styles"
  },
  {
    href: "/roadmap",
    label: "Roadmap"
  },
  {
    href: "/updates",
    label: "Updates"
  }
];

export const Navbar = ({ initialUser }: { initialUser?: InitialUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  // Server-rendered session state paints instantly; the client session takes
  // over once resolved (e.g. right after sign-out)
  const isSignedIn = isPending ? !!initialUser : !!session?.user;

  return (
    <header className="sticky top-0 z-40 border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-background/70 flex items-center justify-between py-3 backdrop-blur-md">
          <Logo className="flex items-center gap-2" />
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              <HugeiconsIcon icon={SunIcon} className="size-4 dark:hidden" />
              <HugeiconsIcon icon={MoonIcon} className="size-4 hidden dark:block" />
            </Button>
            <UserMenu initialUser={initialUser} />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <HugeiconsIcon icon={Menu} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer lg:hidden" />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="bg-card border-secondary flex flex-col justify-between rounded-tr-2xl rounded-br-2xl px-4">
                <div>
                  <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center">
                      <Logo className="flex items-center gap-2" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    {routeList.map((route, i) => (
                      <Button
                        key={i}
                        onClick={() => setIsOpen(false)}
                        asChild
                        variant="ghost"
                        className="justify-start text-base">
                        <Link href={route.href}>{route.label}</Link>
                      </Button>
                    ))}
                    {isSignedIn ? (
                      <Button asChild onClick={() => setIsOpen(false)}>
                        <Link href="/dashboard">
                          <HugeiconsIcon icon={LayoutDashboard} className="size-4" />
                          My Account
                        </Link>
                      </Button>
                    ) : (
                      <Button aria-label="Get Admin Template" asChild>
                        <Link href="/pricing">Get All Access</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* <!-- Desktop --> */}
          <NavigationMenu className="mx-auto hidden lg:block">
            <NavigationMenuList className="space-x-0">
              {routeList.map((route, i) => (
                <Fragment key={i}>
                  {route.items?.length ? (
                    <NavigationMenuItem key={route.label}>
                      <NavigationMenuTrigger>{route.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[240px] gap-2 md:grid-cols-1">
                          {route.items.map((subRoute) => (
                            <ListItem
                              key={subRoute.label}
                              title={subRoute.label}
                              href={subRoute.href}
                              isComing={subRoute.isComing as boolean}>
                              {subRoute.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={route.label}>
                      <NavigationMenuLink
                        asChild
                        className={cn(navigationMenuTriggerStyle(), "bg-transparent!")}>
                        <Link href={route.href}>{route.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden gap-2 lg:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              <HugeiconsIcon icon={SunIcon} className="size-4 dark:hidden" />
              <HugeiconsIcon icon={MoonIcon} className="size-4 hidden dark:block" />
            </Button>
            {isSignedIn ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <HugeiconsIcon icon={LayoutDashboard} className="size-4" />
                  My Account
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/ecommerce">Preview</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/pricing">Get All Access</Link>
                </Button>
              </>
            )}
            <UserMenu initialUser={initialUser} />
          </div>
        </div>
      </div>
      <LoginDialog />
      <ThanksDialog />
    </header>
  );
};

function ListItem({
  title,
  children,
  href,
  isComing,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; isComing: boolean }) {
  return (
    <li {...props} className={cn({ "pointer-events-none opacity-60": isComing })}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="leading-none font-semibold">
            {title} {isComing ? <Badge variant="outline">Coming soon</Badge> : null}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
