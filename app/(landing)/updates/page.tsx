import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Updates | Shadcn UI Dashboard",
  description:
    "Changelog for the Shadcn UI Admin Dashboard Template: every new page, block, improvement and fix, release by release."
};

import { releases, type Release } from "@/@data/releases";

const typeStyles: Record<Release["changes"][number]["type"], string> = {
  Added: "text-foreground",
  Improved: "text-muted-foreground",
  Fixed: "text-muted-foreground"
};

export default function UpdatesPage() {
  return (
    <main className="px-4">
      <div className="mx-auto max-w-4xl py-16 lg:py-24">
        <header className="mb-16">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            Changelog
          </p>
          <h1 className="font-heading mb-4 text-4xl md:text-5xl">Updates</h1>
          <p className="text-muted-foreground max-w-xl text-lg text-balance">
            Every release, documented. Own the template already? Pull the latest from the private
            repository in your{" "}
            <Link href="/dashboard" className="text-foreground underline underline-offset-4">
              account dashboard
            </Link>
            .
          </p>
        </header>

        <ol className="space-y-0">
          {releases.map((release, index) => (
            <li
              key={release.version}
              className="grid grid-cols-1 gap-4 border-t py-10 md:grid-cols-[180px_1fr] md:gap-10">
              <div className="flex items-start gap-3 md:flex-col md:gap-1.5">
                <Badge variant={index === 0 ? "default" : "secondary"} className="font-mono">
                  {release.version}
                </Badge>
                <time className="text-muted-foreground pt-0.5 font-mono text-xs md:pt-1">
                  {release.date}
                </time>
              </div>
              <div>
                <h2 className="font-heading mb-4 text-xl">{release.title}</h2>
                <ul className="space-y-2.5">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-baseline gap-3 text-sm leading-relaxed">
                      <span
                        className={`w-[4.5rem] shrink-0 font-mono text-xs tracking-wide uppercase ${typeStyles[change.type]}`}>
                        {change.type}
                      </span>
                      <span className="text-muted-foreground">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-col items-center gap-4 border-t py-12 text-center">
          <p className="text-muted-foreground max-w-md text-balance">
            Want to influence what ships next? The roadmap is public. Vote on what matters to you.
          </p>
          <Button variant="outline" asChild>
            <Link href="/roadmap">View the roadmap</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
