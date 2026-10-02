import { HugeiconsIcon } from "@hugeicons/react";
import {
  Browser as AppWindow,
  ArrowUpRight,
  LayoutDashboard
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ShowcaseItem = {
  title: string;
  href: string;
  image: string;
};

const dashboards: ShowcaseItem[] = [
  { title: "Ecommerce", href: "/ecommerce", image: "/screenshots/ecommerce.png" },
  { title: "CRM", href: "/crm", image: "/screenshots/crm.png" },
  { title: "Banking", href: "/banking", image: "/screenshots/banking.png" },
  { title: "Real Estate", href: "/real-estate", image: "/screenshots/real-estate.png" },
  { title: "Logistics", href: "/logistics", image: "/screenshots/logistics.png" }
];

const webApps: ShowcaseItem[] = [
  { title: "AI Chatbot", href: "/ai-chatbot", image: "/screenshots/ai-chatbot.png" },
  { title: "Chats", href: "/chats", image: "/screenshots/chats.png" },
  { title: "Kanban Board", href: "/kanban-board", image: "/screenshots/kanban-board.png" },
  { title: "POS App", href: "/pos-app", image: "/screenshots/pos-app.png" },
  { title: "Education", href: "/education/detail", image: "/screenshots/education.png" }
];

const ShowcaseGrid = ({ items }: { items: ShowcaseItem[] }) => (
  <div className="grid grid-cols-1 border-t border-s sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item, index) => (
      <Link
        key={item.href}
        href={item.href}
        className="group hover:bg-muted/40 flex flex-col border-e border-b transition-colors">
        <div className="bg-muted/40 border-b p-3 lg:p-4">
          <img
            src={item.image}
            alt={`${item.title} dashboard preview for Shadcn UI Dashboard`}
            loading="lazy"
            className="aspect-video w-full rounded-md border object-cover object-top shadow-sm"
          />
        </div>
        <div className="flex items-center justify-between p-4 lg:px-5">
          <div className="flex items-baseline gap-3">
            <span className="text-muted-foreground/60 font-mono text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-semibold">{item.title}</h3>
          </div>
          <HugeiconsIcon icon={ArrowUpRight} className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    ))}
  </div>
);

export default function Showcase() {
  return (
    <section id="dashboards" className="bg-background relative z-10 scroll-mt-14">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:py-28">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
              02 · Live previews
            </p>
            <h2 className="font-heading text-3xl text-balance lg:text-4xl">
              Every dashboard, ready before you start
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 lg:justify-end">
            <p className="text-muted-foreground text-lg text-balance">
              Five full admin dashboards and five real-world app screens, all built from the same
              components and design tokens. Open any of them in the live demo and click around.
            </p>
            <Link
              href="/ecommerce"
              className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1.5 font-mono text-xs tracking-wide uppercase transition-colors">
              Open the live demo
              <HugeiconsIcon icon={ArrowUpRight} className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <Tabs defaultValue="dashboards" className="gap-4">
          <TabsList>
            <TabsTrigger value="dashboards">
              <HugeiconsIcon icon={LayoutDashboard} className="size-4" strokeWidth={1.75} />
              Dashboard variations
            </TabsTrigger>
            <TabsTrigger value="web-apps">
              <HugeiconsIcon icon={AppWindow} className="size-4" strokeWidth={1.75} />
              Web apps
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboards">
            <ShowcaseGrid items={dashboards} />
          </TabsContent>
          <TabsContent value="web-apps">
            <ShowcaseGrid items={webApps} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
