import { Metadata } from "next";
import { generateMeta } from "@/lib/metadata";
import { categories } from "./categories";
import { blocksCount } from "@/lib/content-count";
import BlockListItem from "@/components/block-list-item";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Free & Premium Dashboard Shadcn Blocks",
    description:
      "Browse free & premium Shadcn UI Blocks & Sections. Copy and paste instantly or install via the shadcn CLI.",
    canonical: "/blocks"
  });
}

export default function Page() {
  return (
    <section>
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-6 lg:space-y-14 lg:px-10 lg:py-10">
        <header className="space-y-3 text-balance lg:max-w-4xl">
          <h1 className="font-heading text-3xl lg:text-4xl">Shadcn UI Dashboard Blocks</h1>
          <p className="text-muted-foreground leading-relaxed text-balance">
            Explore our carefully crafted collection of {blocksCount.total} shadcn block sets. Built
            with Tailwind CSS, shadcn/ui, and React. Copy and paste the code instantly or download
            it via the CLI.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {categories.map((cat) => (
            <BlockListItem
              key={cat.href}
              href={cat.href}
              title={cat.sidebarTitle}
              isNew={(cat as any).isNew ?? false}
              image={cat.image}
              countText={
                cat.components.length > 1
                  ? `${cat.components.length} blocks`
                  : `${cat.components.length} block`
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
