// @ts-nocheck
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark,
  ChartColumn,
  ChevronDown,
  ChevronsUpDown,
  GitPullRequestArrow,
  LayoutGrid,
  PanelRight,
  Plus,
  Star,
  Users,
  UserX
} from "@hugeicons/core-free-icons";
import * as React from "react";

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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const data = {
  tickets: [
    { title: "All tickets", icon: LayoutGrid, isActive: true },
    { title: "Dashboard", icon: ChartColumn },
    { title: "Knowledge", icon: Bookmark },
    { title: "Team", icon: Users },
    { title: "Request types", icon: GitPullRequestArrow }
  ],
  views: [
    { title: "Starred tickets", icon: Star },
    { title: "Unassigned", icon: UserX }
  ],
  channels: [
    { title: "HR Hub", dotClass: "bg-chart-5" },
    { title: "Financial ops", dotClass: "bg-chart-3" },
    { title: "Design", dotClass: "bg-chart-1" }
  ]
};

function NavGroup({
  label,
  action,
  children
}: {
  label: string;
  action?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            <HugeiconsIcon icon={ChevronDown} className="mr-1.5 size-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
            {label}
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        {action ? (
          <SidebarGroupAction title={`Add to ${label}`}>
            <HugeiconsIcon icon={Plus} />
            <span className="sr-only">Add to {label}</span>
          </SidebarGroupAction>
        ) : null}
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function WorkspaceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="flex-1">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <HugeiconsIcon icon={LayoutGrid} className="size-4 rotate-45" />
          </div>
          <span className="truncate font-medium">My workspace</span>
          <HugeiconsIcon icon={ChevronDown} className="text-muted-foreground size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuItem>
          My workspace
          <HugeiconsIcon icon={ChevronsUpDown} className="ml-auto size-4 opacity-0" />
        </DropdownMenuItem>
        <DropdownMenuItem>Support EU</DropdownMenuItem>
        <DropdownMenuItem>Support US</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={Plus} /> Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1">
            <WorkspaceSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground shrink-0"
              onClick={toggleSidebar}>
              <HugeiconsIcon icon={PanelRight} />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavGroup label="Tickets">
            <SidebarMenu>
              {data.tickets.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href="#">
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </NavGroup>

          <NavGroup label="Views" action>
            <SidebarMenu>
              {data.views.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </NavGroup>

          <NavGroup label="Channels" action>
            <SidebarMenu>
              {data.channels.map((channel) => (
                <SidebarMenuItem key={channel.title}>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <span className="flex size-4 items-center justify-center">
                        <span className={`size-2 rounded-full ${channel.dotClass}`} />
                      </span>
                      <span>{channel.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </NavGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
