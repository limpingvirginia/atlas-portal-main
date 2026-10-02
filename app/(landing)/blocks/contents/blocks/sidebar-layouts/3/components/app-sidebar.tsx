// @ts-nocheck
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartLine,
  ChartColumn as FileChartColumn,
  Folder,
  House,
  Inbox,
  Layers2,
  LayoutGrid,
  Loader,
  BubbleChatIcon as MessageCircleMore,
  MessagesSquare,
  Minus,
  Plus,
  SearchIcon,
  Settings,
  CheckSquare as SquareCheck,
  AccountSettingIcon as UserRoundCog,
  Users,
  Wrench
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const data = {
  rail: [
    { title: "Home", icon: House },
    { title: "Analytics", icon: ChartLine, isActive: true },
    { title: "Layers", icon: Layers2 },
    { title: "Apps", icon: LayoutGrid },
    { title: "Customers", icon: Users },
    { title: "Inbox", icon: Inbox },
    { title: "Tools", icon: Wrench },
    { title: "Reports", icon: FileChartColumn }
  ],
  railFooter: [
    { title: "Account", icon: UserRoundCog },
    { title: "Support", icon: MessageCircleMore }
  ],
  account: [
    { title: "Home", icon: House },
    { title: "Dashboard", icon: ChartLine },
    { title: "Projects", icon: Folder },
    { title: "Tasks", icon: SquareCheck },
    {
      title: "Settings",
      icon: Settings,
      isOpen: true,
      items: [
        { title: "My details" },
        { title: "My profile", isActive: true },
        { title: "Security" },
        { title: "Integrations" },
        { title: "Billing" }
      ]
    }
  ],
  shared: [
    { title: "Team space", icon: Users },
    { title: "Client projects", icon: Folder },
    { title: "Review tasks", icon: SquareCheck }
  ]
};

function NavTree({ items }: { items: (typeof data.account)[number][] }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible key={item.title} asChild defaultOpen={item.isOpen} className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <HugeiconsIcon icon={item.icon} />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            {item.items?.length ? (
              <>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="text-muted-foreground">
                    <HugeiconsIcon icon={Plus} className="group-data-[state=open]/collapsible:hidden" />
                    <HugeiconsIcon icon={Minus} className="hidden group-data-[state=open]/collapsible:block" />
                    <span className="sr-only">Toggle {item.title}</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                          <a href="#">
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : (
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="text-muted-foreground">
                  <HugeiconsIcon icon={Plus} />
                  <span className="sr-only">Expand {item.title}</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
            )}
          </SidebarMenuItem>
        </Collapsible>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="#">
            <span className="relative">
              <HugeiconsIcon icon={MessagesSquare} />
              <span className="border-sidebar bg-primary absolute -top-0.5 -right-0.5 size-2 rounded-full border" />
            </span>
            <span>Messages</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="overflow-hidden *:data-[sidebar=sidebar]:flex-row" {...props}>
      {/* Icon rail */}
      <Sidebar collapsible="none" className="bg-sidebar-accent/50 w-14 border-r">
        <SidebarHeader className="items-center pt-4">
          <a href="#">
            <HugeiconsIcon icon={Loader} className="text-primary size-7" strokeWidth={2.5} />
            <span className="sr-only">Acme Inc</span>
          </a>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="items-center gap-2">
              {data.rail.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    tooltip={item.title}
                    className="size-9 justify-center"
                    asChild>
                    <a href="#">
                      <HugeiconsIcon icon={item.icon} />
                      <span className="sr-only">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarGroup className="mt-auto">
          <SidebarMenu className="items-center gap-2">
            {data.railFooter.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} className="size-9 justify-center" asChild>
                  <a href="#">
                    <HugeiconsIcon icon={item.icon} />
                    <span className="sr-only">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>

      {/* Navigation panel */}
      <Sidebar collapsible="none" className="flex-1">
        <SidebarHeader className="gap-3 p-4 pb-0">
          <h2 className="font-heading text-xl font-semibold tracking-tight">Overview</h2>
          <div className="relative">
            <HugeiconsIcon icon={SearchIcon} className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <SidebarInput placeholder="Search" className="pl-8" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Tabs defaultValue="account" className="gap-0">
            <TabsList variant="line" className="w-full justify-start border-b px-4">
              <TabsTrigger value="account" className="flex-none px-2">
                My account
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-none px-2">
                Shared with me
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-full">
              <TabsContent value="account">
                <SidebarGroup>
                  <NavTree items={data.account} />
                </SidebarGroup>
              </TabsContent>
              <TabsContent value="shared">
                <SidebarGroup>
                  <NavTree items={data.shared} />
                </SidebarGroup>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
