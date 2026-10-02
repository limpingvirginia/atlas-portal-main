import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight,
  Puzzle as Blocks,
  Map,
  MonitorPlay,
  Newspaper
} from "@hugeicons/core-free-icons";
import Link from "next/link";

const destinations = [
  {
    icon: MonitorPlay,
    title: "Live demo",
    description: "Click through every dashboard, page and flow in your browser.",
    href: "/ecommerce",
    cta: "Open the demo"
  },
  {
    icon: Blocks,
    title: "Blocks library",
    description: "Browse ready-made sections you can copy into any project.",
    href: "/blocks",
    cta: "Browse blocks"
  },
  {
    icon: Map,
    title: "Roadmap",
    description: "See what's shipping next and vote on what matters to you.",
    href: "/roadmap",
    cta: "View roadmap"
  },
  {
    icon: Newspaper,
    title: "Updates",
    description: "A changelog of every release: new pages, blocks and fixes.",
    href: "/updates",
    cta: "Read the changelog"
  }
];

export default function Explore() {
  return (
    <section className="bg-background relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            03 · Explore
          </p>
          <h2 className="font-heading mb-4 text-3xl lg:text-4xl">See it all in action</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Everything is out in the open: the demo, the blocks and where the template is headed.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-s sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group hover:bg-muted/40 relative flex flex-col gap-4 border-e border-b p-6 transition-colors lg:p-8">
              <div className="flex items-center justify-between">
                <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={1.75} />
                <HugeiconsIcon icon={ArrowUpRight} className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground mt-auto font-mono text-xs tracking-wide uppercase transition-colors">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
