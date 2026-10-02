"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { categories } from "../../categories";
import { Label } from "@/components/ui/label";

export default function ComponentsSidebar() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const { toggleSidebar } = useSidebar();

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const lower = searchTerm.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.sidebarTitle.toLowerCase().includes(lower) ||
        c.description?.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  return (
    <Sidebar onClick={toggleSidebar} collapsible="none" className="bg-transparent!">
      <SidebarHeader onClick={(e) => e.stopPropagation()}>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative -ms-3">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <SidebarInput
              id="search"
              placeholder="Search blocks..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="pl-8"
            />
            <HugeiconsIcon icon={Search} className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent key={searchTerm.length} className="gap-0">
        {filtered.length === 0 ? (
          <SidebarGroup className="px-4 lg:px-0">
            <SidebarGroupContent>
              <div className="text-muted-foreground py-8 text-center text-sm">
                No results found.
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup className="px-4 lg:px-0">
            <SidebarGroupLabel className="text-foreground text-sm">Blocks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuSub className="ms-0 gap-0 border-l-0 ps-0">
                {filtered.map((item) => (
                  <SidebarMenuSubItem key={item.href}>
                    <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                      <Link
                        href={item.href}
                        className="hover:bg-sidebar-accent/40 hover:text-accent-foreground! text-accent-foreground/70! data-[active=true]:text-accent-foreground! flex justify-between opacity-80 hover:opacity-100 data-[active=true]:opacity-100"
                      >
                        {item.sidebarTitle}
                        <span className="text-xs opacity-70">{item.components?.length}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
