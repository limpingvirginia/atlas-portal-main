import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accessibility,
  ArrowRight,
  Puzzle as Blocks,
  Braces,
  LayoutDashboard,
  MoonStar,
  Palette,
  RefreshCw,
  Smartphone,
  Table2,
  ToyBrickIcon as ToyBrick
} from "@hugeicons/core-free-icons";
import Link from "next/link";

const features = [
  {
    icon: LayoutDashboard,
    title: "20+ page templates",
    description:
      "Analytics, e-commerce, CRM, projects, calendar, chat and full auth flows, with every screen wired to realistic data and navigation, so day one feels like week six."
  },
  {
    icon: ToyBrick,
    title: "50+ polished components",
    description:
      "The complete shadcn/ui set, consistently themed and extended with the pieces real dashboards actually need: stat cards, file uploads, date pickers, command menus."
  },
  {
    icon: Table2,
    title: "Data-heavy by default",
    description:
      "TanStack tables with sorting, filtering and pagination, Recharts visualizations for every chart type, and drag-and-drop kanban boards, all fed by typed mock data."
  },
  {
    icon: MoonStar,
    title: "Dark mode, first-class",
    description:
      "Every screen is designed in light and dark from the start. One set of CSS variables drives both, so your brand colors carry over without a second stylesheet."
  },
  {
    icon: Braces,
    title: "TypeScript end to end",
    description:
      "App Router, React Server Components and Zod-validated forms with strict types from the API to the UI. Rename a field and the compiler walks you to every screen it touches."
  },
  {
    icon: Blocks,
    title: "Copy-paste blocks",
    description:
      "A growing library of ready-made sections (sidebars, charts, forms, kanban views) that drop into any shadcn/ui project as-is, or install straight from the CLI."
  },
  {
    icon: Smartphone,
    title: "Responsive on every screen",
    description:
      "Sidebars collapse into drawers, tables scroll without breaking layout, and touch targets stay comfortable, from a phone in the field to a wall-mounted display."
  },
  {
    icon: Accessibility,
    title: "Accessible out of the box",
    description:
      "Built on Radix primitives with keyboard navigation, focus management and sensible ARIA everywhere, so shipping something usable by everyone is the default."
  },
  {
    icon: RefreshCw,
    title: "Updated month after month",
    description:
      "New pages, blocks and component upgrades land regularly, with lifetime access to every release, so your dashboard keeps improving after you ship it."
  }
];

export default function Features() {
  return (
    <section className="bg-background relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            01 · What&apos;s inside
          </p>
          <h2 className="font-heading mb-4 text-3xl lg:text-4xl">
            Everything an admin needs, already built
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Skip the setup weeks. Start from a codebase where the components, pages and patterns
            are already in place, then make it yours.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-s md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="group hover:bg-muted/40 border-e border-b p-6 transition-colors lg:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-foreground flex size-10 items-center justify-center rounded-lg border">
                  <HugeiconsIcon icon={feature.icon} className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-muted-foreground/60 font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/ecommerce"
            className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1.5 text-sm transition-colors">
            See every page in the live demo
            <HugeiconsIcon icon={ArrowRight} className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
