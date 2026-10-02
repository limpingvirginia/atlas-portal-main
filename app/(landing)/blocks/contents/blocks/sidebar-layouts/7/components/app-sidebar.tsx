// @ts-nocheck
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bell,
  BookOpen,
  Check,
  ChevronsUpDown,
  FileEditIcon as FilePenLine,
  House,
  Lightbulb,
  LifeBuoy,
  LogOut,
  Megaphone,
  Plus,
  SearchIcon,
  Settings
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const data = {
  user: { name: "Rafaelle Gio", email: "rafaelle@surfe.com", initials: "RG" },
  plans: ["Essential Plan", "Business Plan", "Enterprise Plan"],
  main: [
    { title: "Dashboard", icon: House },
    { title: "Activity", icon: Bell, hasNotification: true },
    { title: "Playbooks", icon: BookOpen }
  ],
  outreach: [
    { title: "Templates", icon: FilePenLine },
    { title: "Engage", icon: Megaphone, isActive: true },
    { title: "Insights", icon: Lightbulb }
  ],
  shared: [
    { title: "Social Selling B2B", swatchClass: "bg-chart-1" },
    { title: "CRM Referrals", swatchClass: "bg-chart-3" },
    { title: "Ireland Partnerships", swatchClass: "bg-chart-5" }
  ],
  help: [
    { title: "Settings", icon: Settings },
    { title: "Help Centre", icon: LifeBuoy }
  ]
};

function PlanSwitcher() {
  const [plan, setPlan] = React.useState(data.plans[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg text-base font-semibold">
            S
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold">Surfe</span>
            <span className="text-muted-foreground truncate text-xs">{plan}</span>
          </div>
          <HugeiconsIcon icon={ChevronsUpDown} className="text-muted-foreground ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Plans</DropdownMenuLabel>
        {data.plans.map((item) => (
          <DropdownMenuItem key={item} onSelect={() => setPlan(item)}>
            {item}
            {item === plan ? <HugeiconsIcon icon={Check} className="ml-auto" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg text-xs">
                  {data.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data.user.name}</span>
                <span className="text-muted-foreground truncate text-xs">{data.user.email}</span>
              </div>
              <HugeiconsIcon icon={ChevronsUpDown} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuItem>
              <HugeiconsIcon icon={Settings} /> Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon icon={LogOut} /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <PlanSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="relative px-2">
          <HugeiconsIcon icon={SearchIcon} className="text-muted-foreground pointer-events-none absolute top-1/2 left-4.5 size-4 -translate-y-1/2" />
          <SidebarInput placeholder="Search" className="pl-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.main.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <span className="relative">
                          <HugeiconsIcon icon={item.icon} />
                          {item.hasNotification ? (
                            <span className="bg-destructive border-sidebar absolute -top-0.5 -right-0.5 size-2 rounded-full border" />
                          ) : null}
                        </span>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Outreach</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.outreach.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className="data-[active=true]:text-primary">
                      <a href="#">
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Shared</SidebarGroupLabel>
            <SidebarGroupAction title="Add shared list">
              <HugeiconsIcon icon={Plus} />
              <span className="sr-only">Add shared list</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.shared.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <span className="flex size-4 items-center justify-center">
                          <span className={cn("size-3.5 rounded-sm", item.swatchClass)} />
                        </span>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {data.help.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="text-muted-foreground">
                <a href="#">
                  <HugeiconsIcon icon={item.icon} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
