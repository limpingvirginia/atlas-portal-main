import { Button } from "@/components/ui/button";
import Link from "next/link";
import { releases } from "@/@data/releases";

const latestRelease = releases[0];

const stats = [
  { value: "50+", label: "Components" },
  { value: "20+", label: "Page Templates" },
  { value: "1k+", label: "Happy Customers" },
  { value: "99%", label: "Satisfaction Rate" }
];

const techs = [
  { name: "Next.js", logo: "/techs/nextjs.svg" },
  { name: "React", logo: "/techs/react.svg" },
  { name: "Vue.js", logo: "/techs/vuejs.svg" },
  { name: "Svelte", logo: "/techs/svelte.svg" },
  { name: "Angular", logo: "/techs/angular.svg" }
];

export const HeroSection = () => {
  return (
    <section className="relative z-0 w-full overflow-hidden px-4">
      {/* Dot-grid backdrop, fading out toward the fold */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_55%,transparent_100%)]"
      />

      <div className="relative mx-auto grid place-items-center pt-16 md:pt-24 lg:max-w-(--breakpoint-xl)">
        <div className="space-y-8 pb-16 text-center max-w-5xl">
          <Link
            href="/updates"
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards text-muted-foreground hover:text-foreground hover:border-foreground/30 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors duration-700">
            <span className="relative flex size-1.5">
              <span className="bg-foreground/60 absolute inline-flex h-full w-full animate-ping rounded-full" />
              <span className="bg-foreground relative inline-flex size-1.5 rounded-full" />
            </span>
            {latestRelease.version} · {latestRelease.title}
          </Link>

          <div
            className="animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards space-y-4 duration-700"
            style={{ animationDelay: "100ms" }}>
            <h1 className="font-heading text-4xl text-balance md:text-5xl lg:text-6xl leading-tight">
              Shadcn UI & Tailwind CSS Admin Dashboard Template
            </h1>
            <p className="text-muted-foreground text-lg text-balance md:text-xl leading-relaxed">
              A production-ready shadcn admin dashboard template with 50+ reusable components, 20+ page layouts, and ready-to-use UI blocks for Next.js, React, TypeScript, and Tailwind CSS. Built on Base UI primitives to kickstart your SaaS, admin panel, or internal tool.
            </p>
          </div>

          <div
            className="animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards space-y-3 duration-700"
            style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/pricing">Get the Template</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#dashboards">Browse Admin Dashboards</Link>
              </Button>
            </div>
          </div>

          <div
            className="animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards flex flex-wrap items-start justify-center gap-6 pt-2 duration-700 sm:gap-10"
            style={{ animationDelay: "300ms" }}>
            {techs.map((tech) => (
              <div key={tech.name} className="flex flex-col items-center gap-2.5">
                <span className="bg-background flex size-14 items-center justify-center rounded-full border shadow-xs">
                  <img src={tech.logo} alt={`${tech.name} logo`} className="size-6" loading="lazy" />
                </span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        <figure
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards relative aspect-video w-full duration-1000 lg:-mb-32"
          style={{ animationDelay: "450ms" }}>
          <img
            className="relative mx-auto flex w-full items-center mask-b-from-50% mask-b-to-90% object-cover rounded-2xl border-5 leading-none dark:hidden"
            src="/hero.png"
            alt="Shadcn UI Dashboard admin template preview"
          />
          <img
            className="relative mx-auto hidden w-full mask-b-from-50% mask-b-to-90% rounded-2xl border-5 object-cover leading-none dark:block"
            src="/hero-dark.png"
            alt="Shadcn UI Dashboard admin template preview (dark mode)"
          />
        </figure>
      </div>
    </section>
  );
};
