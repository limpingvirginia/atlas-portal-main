// @ts-nocheck
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Command,
  Forward,
  Gem,
  House,
  LogOut,
  MessagesSquare,
  Phone,
  Plus,
  Layers as SquareStack,
  Users
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const data = {
  user: { name: "Spencer Shulem", email: "spencer@buildbetter.ai", initials: "SS" },
  orgs: [
    { name: "BuildBetter", icon: Command, isActive: true },
    { name: "Dribbble", icon: Gem }
  ],
  nav: [
    { title: "Home", icon: House, isActive: true },
    { title: "My Projects", icon: SquareStack },
    { title: "My Calls", icon: Phone },
    { title: "Chat", icon: MessagesSquare, hasNotification: true },
    { title: "Shared With Me", icon: Forward },
    { title: "People", icon: Users }
  ],
  spaces: [
    {
      name: "Product",
      swatchClass: "border-chart-1 bg-chart-1/20",
      isOpen: true,
      pages: ["All Hands", "Roadmap"]
    },
    {
      name: "Design",
      swatchClass: "border-chart-3 bg-chart-3/20",
      hasNotification: true,
      pages: ["Design System", "Brand Refresh"]
    },
    {
      name: "User Research",
      swatchClass: "border-chart-5 bg-chart-5/20",
      pages: ["Interviews", "Insights"]
    }
  ]
};

function OrgSwitcher() {
  const activeOrg = data.orgs.find((org) => org.isActive) ?? data.orgs[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="flex-1">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <HugeiconsIcon icon={activeOrg.icon} className="size-4" />
          </div>
          <span className="truncate font-medium">{activeOrg.name}</span>
          <HugeiconsIcon icon={ChevronDown} className="text-muted-foreground size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="font-normal">
          <div className="grid text-sm leading-tight">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="text-muted-foreground truncate text-xs">{data.user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data.orgs.map((org) => (
          <DropdownMenuItem key={org.name}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 items-center justify-center rounded-md">
              <HugeiconsIcon icon={org.icon} className="size-3.5" />
            </div>
            {org.name}
            {org.isActive ? <HugeiconsIcon icon={Check} className="ml-auto" /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={LogOut} /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <OrgSwitcher />
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-xs">{data.user.initials}</AvatarFallback>
            </Avatar>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarMenu>
              {data.nav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground">
                    <a href="#">
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.hasNotification ? (
                    <SidebarMenuBadge>
                      <span className="bg-primary size-2 rounded-full" />
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <Collapsible defaultOpen className="group/spaces">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  <HugeiconsIcon icon={ChevronDown} className="mr-1.5 size-3.5 transition-transform group-data-[state=closed]/spaces:-rotate-90" />
                  Spaces
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <SidebarGroupAction title="Add space">
                <HugeiconsIcon icon={Plus} />
                <span className="sr-only">Add space</span>
              </SidebarGroupAction>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.spaces.map((space) => (
                      <Collapsible
                        key={space.name}
                        asChild
                        defaultOpen={space.isOpen}
                        className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <HugeiconsIcon icon={ChevronRight} className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                              <span
                                className={cn(
                                  "size-4 shrink-0 rounded-md border-2",
                                  space.swatchClass
                                )}
                              />
                              <span>{space.name}</span>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {space.hasNotification ? (
                            <SidebarMenuBadge>
                              <span className="bg-primary size-2 rounded-full" />
                            </SidebarMenuBadge>
                          ) : null}
                          <CollapsibleContent>
                            <SidebarMenuSub className="border-none">
                              {space.pages.map((page) => (
                                <SidebarMenuSubItem key={page}>
                                  <SidebarMenuSubButton asChild>
                                    <a href="#">
                                      <span>{page}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
