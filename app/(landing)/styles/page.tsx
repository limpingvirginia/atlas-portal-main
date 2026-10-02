import { Metadata } from "next";
import { generateMeta } from "@/lib/metadata";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Design Styles",
    description:
      "Every design style available for the Shadcn UI Dashboard template: the default Mono style today, with more visual directions on the way.",
    canonical: "/styles"
  });
}

type Style = {
  name: string;
  title: string;
  description: string;
  isDefault?: boolean;
  isComing?: boolean;
  image?: { light: string; dark: string };
};

const styles: Style[] = [
  {
    name: "Mono",
    title: "Quiet, monochrome and content-first",
    description:
      "The default style of Shadcn UI Dashboard. A neutral grayscale palette, high-contrast typography and hairline borders keep the interface out of the way, so your data does the talking. Every component, page and block ships in this style today, in light and dark.",
    isDefault: true,
    image: { light: "/hero.png", dark: "/hero-dark.png" }
  },
  {
    name: "Aurora",
    title: "Vivid gradients with a soft glow",
    description:
      "A colorful take on the same components: gradient accents, tinted surfaces and expressive charts for products that want more personality. Built on the exact same tokens, so switching styles is a theme swap, not a rewrite.",
    isComing: true
  },
  {
    name: "Terra",
    title: "Warm, earthy and easy on the eyes",
    description:
      "Muted warm neutrals, generous radii and softer shadows for calm, long-session tools like CRMs and support desks. Ships with its own chart palette tuned for readability in both themes.",
    isComing: true
  }
];

export default function StylesPage() {
  return (
    <main className="px-4">
      <div className="mx-auto max-w-7xl py-16 lg:py-24">
        <header className="mb-14 max-w-2xl">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            Design styles
          </p>
          <h1 className="font-heading mb-4 text-4xl md:text-5xl">One template, multiple styles</h1>
          <p className="text-muted-foreground text-lg text-balance">
            Every style restyles the same components, pages and blocks through design tokens.
            Pick the look that fits your product. The code underneath stays identical.
          </p>
        </header>

        <div className="border-t">
          {styles.map((style, index) => (
            <section
              key={style.name}
              className="grid grid-cols-1 items-center gap-8 border-b py-10 last:border-b-0 last:pb-0 md:grid-cols-2 lg:gap-14 lg:py-14">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-muted-foreground/60 font-mono text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-heading text-2xl">{style.name}</h2>
                  {style.isDefault && <Badge>Default</Badge>}
                  {style.isComing && <Badge variant="outline">Coming soon</Badge>}
                </div>
                <h3 className="mb-3 text-lg font-semibold">{style.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{style.description}</p>
              </div>

              <div className="bg-muted/40 overflow-hidden rounded-xl border">
                {style.image ? (
                  <>
                    <img
                      src={style.image.light}
                      alt={`${style.name} style preview for Shadcn UI Dashboard`}
                      loading="lazy"
                      className="aspect-video w-full object-cover object-top dark:hidden"
                    />
                    <img
                      src={style.image.dark}
                      alt={`${style.name} style preview (dark mode) for Shadcn UI Dashboard`}
                      loading="lazy"
                      className="hidden aspect-video w-full object-cover object-top dark:block"
                    />
                  </>
                ) : (
                  <div className="text-muted-foreground flex aspect-video w-full items-center justify-center">
                    <span className="font-mono text-xs tracking-widest uppercase">
                      Preview coming soon
                    </span>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
