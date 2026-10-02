// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bell as BellIcon,
  MailIcon
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { NavMainHorizontal } from "./nav-main-horizontal";
import { navigationLinks } from "./app-sidebar";
import { NavUser } from "./nav-user";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";

export function AppHeader() {
  return (
    <header
      data-slot="header"
      className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 [&_[data-logo=description]]:hidden"
    >
      <div className="flex grow items-center">
        <Logo />
        <Separator
          orientation="vertical"
          className="mx-4 data-[orientation=vertical]:h-4"
        />
        <SidebarTrigger className="-ml-1 md:hidden" />
        <NavMainHorizontal items={navigationLinks} />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="icon-sm" variant="ghost" className="relative">
            <HugeiconsIcon icon={MailIcon} />
            <span className="bg-foreground absolute end-0 top-0 inline size-1.5 rounded-full" />
          </Button>
          <Button size="icon-sm" variant="ghost" className="relative">
            <HugeiconsIcon icon={BellIcon} />
            <span className="bg-foreground absolute end-0 top-0 inline size-1.5 rounded-full" />
          </Button>
        </div>
        <NavUser />
      </div>
    </header>
  );
}
