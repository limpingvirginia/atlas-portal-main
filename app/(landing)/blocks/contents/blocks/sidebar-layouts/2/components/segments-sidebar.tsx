// @ts-nocheck
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement as LucideIcon } from "@hugeicons/react";
import {
  Building2,
  Command,
  SearchIcon,
  UserRound
} from "@hugeicons/core-free-icons";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type Segment = {
  name: string;
  icon: LucideIcon;
  isActive?: boolean;
};

const data: { personal: Segment[]; team: Segment[] } = {
  personal: [
    { name: "Most active", icon: UserRound },
    { name: "Top errors", icon: Building2 },
    { name: "Top growth", icon: UserRound, isActive: true },
    { name: "Highest signup rate", icon: UserRound },
    { name: "Signup errors", icon: UserRound },
    { name: "Highest churn risk", icon: Building2 },
    { name: "New this week", icon: UserRound },
    { name: "Power users", icon: UserRound }
  ],
  team: [
    { name: "All customers", icon: Building2 },
    { name: "Enterprise accounts", icon: Building2 },
    { name: "Trial conversions", icon: UserRound },
    { name: "At-risk accounts", icon: Building2 },
    { name: "Expansion ready", icon: UserRound }
  ]
};

function SegmentList({ segments, query }: { segments: Segment[]; query: string }) {
  const filtered = segments.filter((segment) =>
    segment.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="text-muted-foreground px-2 py-8 text-center text-sm">No segments found</div>
    );
  }

  return (
    <SidebarMenu>
      {filtered.map((segment) => (
        <SidebarMenuItem key={segment.name}>
          <SidebarMenuButton asChild isActive={segment.isActive}>
            <a href="#">
              <HugeiconsIcon icon={segment.icon} />
              <span>{segment.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SegmentsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [query, setQuery] = React.useState("");

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="gap-3 p-4 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="px-0 hover:bg-transparent" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={Command} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <h2 className="font-heading text-xl font-semibold tracking-tight">Segments</h2>
        <div className="relative">
          <HugeiconsIcon icon={SearchIcon} className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <SidebarInput
            placeholder="Search for value"
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Tabs defaultValue="personal" className="gap-0">
          <TabsList variant="line" className="w-full justify-start border-b px-4">
            <TabsTrigger value="personal" className="flex-none px-2">
              Personal
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-none px-2">
              Team
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="h-full">
            <TabsContent value="personal">
              <SidebarGroup>
                <SegmentList segments={data.personal} query={query} />
              </SidebarGroup>
            </TabsContent>
            <TabsContent value="team">
              <SidebarGroup>
                <SegmentList segments={data.team} query={query} />
              </SidebarGroup>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  );
}
