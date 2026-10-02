// @ts-nocheck
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bell,
  Building2,
  Calendar,
  ChartLine,
  ChevronDown,
  ChevronsUpDown,
  Grip,
  Info,
  LogOut,
  Minus,
  Moon,
  Plus,
  Send,
  Settings,
  Users,
  Zap
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const data = {
  user: { name: "Olivia Rhye", email: "olivia@leadverse.ai", initials: "OR" },
  general: [
    { title: "Dashboard", icon: Grip },
    {
      title: "Campaigns",
      icon: Zap,
      isOpen: true,
      items: [
        { title: "Product designer", badge: "+99", isActive: true },
        { title: "Software developer", badge: "54" }
      ]
    },
    { title: "Real-time alerts", icon: Bell, badge: "12", alert: true }
  ],
  engage: [
    { title: "Leads", icon: Users },
    { title: "Conversations", icon: Send }
  ],
  research: [
    { title: "Competitors", icon: Building2 },
    { title: "Insights", icon: ChartLine }
  ],
  help: [
    { title: "Book a call", icon: Calendar },
    { title: "Request a feature", icon: Info }
  ]
};

function NavGroup({ label, items }: { label: string; items: any[] }) {
  return (
    <Collapsible defaultOpen className="group/group">
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <CollapsibleTrigger asChild>
          <SidebarGroupAction title={`Toggle ${label}`}>
            <HugeiconsIcon icon={Minus} className="group-data-[state=closed]/group:hidden" />
            <HugeiconsIcon icon={Plus} className="hidden group-data-[state=closed]/group:block" />
            <span className="sr-only">Toggle {label}</span>
          </SidebarGroupAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.items?.length ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isOpen}
                    className="group/collapsible">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <HugeiconsIcon icon={item.icon} />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-180">
                          <HugeiconsIcon icon={ChevronDown} />
                          <span className="sr-only">Toggle {item.title}</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mx-0 border-none px-0">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={subItem.isActive} className="pl-8">
                                <a href="#">
                                  {subItem.isActive ? (
                                    <span className="bg-primary absolute left-3 size-1.5 rounded-full" />
                                  ) : null}
                                  <span>{subItem.title}</span>
                                  <span className="bg-sidebar-accent text-sidebar-accent-foreground ml-auto rounded-md px-1.5 py-0.5 text-xs font-medium">
                                    {subItem.badge}
                                  </span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.badge ? (
                      <SidebarMenuBadge className="bg-sidebar-accent flex items-center gap-1.5 rounded-md px-1.5">
                        {item.alert ? <span className="bg-destructive size-1.5 rounded-full" /> : null}
                        {item.badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function PlanCard() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-sidebar-accent/50 space-y-3 rounded-xl border p-3">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={Moon} className="size-4" />
        <span className="text-sm font-medium">Business plan</span>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Your team has used 66% of your available campaigns. Need more?
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span>Campaigns</span>
          <span className="text-muted-foreground">2/3</span>
        </div>
        <Progress value={66} className="h-1.5" />
        <div className="flex items-center justify-between text-xs">
          <span>Manual syncs</span>
          <span className="text-muted-foreground">1/10</span>
        </div>
        <Progress value={10} className="h-1.5" />
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 px-2 text-xs"
          onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
        <Button variant="link" size="sm" className="h-7 px-2 text-xs">
          See all plans
        </Button>
      </div>
    </div>
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
      <SidebarHeader className="p-4">
        <a href="#" className="flex items-center gap-2">
          <HugeiconsIcon icon={Moon} className="size-6" strokeWidth={2.5} />
          <span className="font-heading text-lg font-semibold">Leadverse.ai</span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavGroup label="General" items={data.general} />
          <NavGroup label="Engage" items={data.engage} />
          <NavGroup label="Research" items={data.research} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="gap-3">
        <SidebarMenu>
          {data.help.map((item) => (
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
        <PlanCard />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
