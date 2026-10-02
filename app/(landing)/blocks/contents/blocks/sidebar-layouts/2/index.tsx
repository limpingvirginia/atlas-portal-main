// @ts-nocheck
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { SegmentsSidebar } from "./components/segments-sidebar";
import { AppHeader } from "./components/app-header";

export default function Page() {
  return (
    <SidebarProvider>
      <SegmentsSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 grid min-h-[100vh] flex-1 place-items-center rounded-xl md:min-h-min">
            <span className="text-muted-foreground text-sm">Content goes here</span>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
