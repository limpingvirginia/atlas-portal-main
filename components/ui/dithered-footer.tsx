"use client";

/**
 * Standalone "Dithered Footer" — KONSOL EXPRESS
 * ------------------------------------------------------------
 * Self-contained React component. No shadcn / next-themes / hugeicons
 * dependencies. Only needs React + Tailwind (for layout utilities).
 *
 * Fonts are loaded ONLINE from Google Fonts (no local font files):
 *   - Kode Mono    -> brand wordmark
 *   - Geist Pixel  -> badge, tagline, links
 *   - Geist Mono   -> column titles
 *
 * Colors use CSS variables with fallbacks, so it works in light & dark
 * without depending on the original project's globals.css.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Tiny utilities                                                     */
/* ------------------------------------------------------------------ */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist+Pixel&family=Kode+Mono:wght@400..700&display=swap";

/** Appends the Google Fonts stylesheet once. */
function useGoogleFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`link[data-df-fonts][href="${FONT_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    link.setAttribute("data-df-fonts", "");
    document.head.appendChild(link);
  }, []);
}

/**
 * true when the page is in dark mode.
 *
 * An explicit theme marker always wins over the OS preference:
 *   <html class="dark"> / <html class="light">
 *   <html data-theme="dark"> / <html data-theme="light">
 *
 * Only when the page exposes no marker at all do we fall back to
 * prefers-color-scheme. This matters for apps like next-themes with
 * `enableSystem={false}`, where the site can be light while the OS is dark.
 * A MutationObserver keeps the canvas colour in sync when the user toggles.
 */
function useDarkMode(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const read = () => {
      if (root.classList.contains("dark")) return true;
      if (root.classList.contains("light")) return false;
      const attr = root.getAttribute("data-theme");
      if (attr === "dark") return true;
      if (attr === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const update = () => setDark(read());
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return dark;
}

/* ------------------------------------------------------------------ */
/*  Inline shadcn-style primitives                                     */
/* ------------------------------------------------------------------ */

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("df-badge inline-flex items-center rounded-sm px-2 py-0.5 text-xs leading-none", className)}>
      {children}
    </span>
  );
}

function Separator({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("df-sep block h-px w-full", className)} />;
}

/* ------------------------------------------------------------------ */
/*  AnimatedLink                                                       */
/* ------------------------------------------------------------------ */

type AnimatedLinkVariant = "left" | "right" | "center";

const underlineVariants: Record<AnimatedLinkVariant, string> = {
  left: "before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100",
  right: "before:origin-left before:scale-x-0 hover:before:origin-right hover:before:scale-x-100",
  center: "before:origin-center before:scale-x-0 hover:before:scale-x-100",
};

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-[0.3em] size-[0.55em] text-[var(--df-muted)] transition-all duration-300 group-hover:-translate-y-[0.15em] group-hover:translate-x-[0.15em] group-hover:text-[var(--df-foreground)] motion-reduce:transition-none"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

interface AnimatedLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  variant?: AnimatedLinkVariant;
  showArrow?: boolean;
}

function AnimatedLink({
  variant = "left",
  showArrow = true,
  className,
  children,
  href,
  ...props
}: AnimatedLinkProps) {
  const classes = cn(
    "group relative inline-flex w-fit items-center text-[var(--df-foreground)]",
    "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
    "before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:before:transition-none",
    underlineVariants[variant],
    className
  );

  const arrow = showArrow ? <ArrowUpRight /> : null;

  if (href == null) {
    return (
      <span className={cn(classes, "cursor-default")}>
        {children}
        {arrow}
      </span>
    );
  }

  return (
    <a className={classes} href={href} {...props}>
      {children}
      {arrow}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  FlickeringGrid (canvas)                                            */
/* ------------------------------------------------------------------ */

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  topScatter?: number;
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  topScatter = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    const toRGBA = (c: string) => {
      if (typeof window === "undefined") return "rgba(0, 0, 0,";
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "rgba(255, 0, 0,";
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b},`;
    };
    return toRGBA(color);
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      const masks = new Float32Array(cols * rows);
      for (let i = 0; i < masks.length; i++) masks[i] = Math.random();
      return { cols, rows, squares, masks, dpr };
    },
    [squareSize, gridGap, maxOpacity]
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) squares[i] = Math.random() * maxOpacity;
      }
    },
    [flickerChance, maxOpacity]
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      masks: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (topScatter > 0 && rows > 1) {
            const depth = j / (rows - 1);
            if (masks[i * rows + j] < (1 - depth) * topScatter) continue;
          }
          const opacity = squares[i * rows + j];
          ctx.fillStyle = `${memoizedColor}${opacity})`;
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr
          );
        }
      }
    },
    [memoizedColor, squareSize, gridGap, topScatter]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const paint = () =>
        drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.masks, gridParams.dpr);
      paint();
      const stillObserver = new ResizeObserver(() => {
        updateCanvasSize();
        paint();
      });
      stillObserver.observe(container);
      return () => stillObserver.disconnect();
    }

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.masks, gridParams.dpr);
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => updateCanvasSize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 });
    intersectionObserver.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      <canvas ref={canvasRef} className="pointer-events-none" style={{ width: canvasSize.width, height: canvasSize.height }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Dither mask + scoped styles                                        */
/* ------------------------------------------------------------------ */

const DITHER =
  "url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27360%27%20height%3D%27240%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270.04%27%20stop-color%3D%27%23000%27%2F%3E%3Cstop%20offset%3D%270.96%27%20stop-color%3D%27%23fff%27%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%27f%27%20x%3D%270%27%20y%3D%270%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20color-interpolation-filters%3D%27sRGB%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.45%27%20numOctaves%3D%272%27%20seed%3D%277%27%20stitchTiles%3D%27stitch%27%20result%3D%27n%27%2F%3E%3CfeColorMatrix%20in%3D%27n%27%20type%3D%27matrix%27%20values%3D%271%200%200%200%200%201%200%200%200%200%201%200%200%200%200%200%200%200%200%201%27%20result%3D%27ng%27%2F%3E%3CfeComposite%20in%3D%27SourceGraphic%27%20in2%3D%27ng%27%20operator%3D%27arithmetic%27%20k2%3D%270.5%27%20k3%3D%270.5%27%20result%3D%27s%27%2F%3E%3CfeComponentTransfer%20in%3D%27s%27%20result%3D%27t%27%3E%3CfeFuncR%20type%3D%27discrete%27%20tableValues%3D%270%201%27%2F%3E%3C%2FfeComponentTransfer%3E%3CfeColorMatrix%20in%3D%27t%27%20type%3D%27matrix%27%20values%3D%270%200%200%200%201%200%200%200%200%200.5%200%200%200%200%200%201%200%200%200%200%27%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url%28%23g%29%27%20filter%3D%27url%28%23f%29%27%2F%3E%3C%2Fsvg%3E')";

const GRID = "radial-gradient(circle, #000 0.9px, transparent 1.3px)";

const STYLES = `
/* theme tokens (override from your own CSS if you like) */
.df-root {
  --df-background: #ffffff;
  --df-foreground: #171717;
  --df-border: #e5e5e5;
  --df-muted: #737373;
  --df-badge-border: #e5e5e5;
  --df-accent: #ff6a00;
}
.df-root.dark,
:where(.dark, [data-theme='dark']) .df-root {
  --df-background: #0a0a0a;
  --df-foreground: #ededed;
  --df-border: #262626;
  --df-muted: #a3a3a3;
  --df-badge-border: #262626;
}

/* font utilities */
.df-root .font-kode-mono { font-family: 'Kode Mono', ui-monospace, monospace; }
.df-root .font-geist-pixel { font-family: 'Geist Pixel', 'Geist Mono', ui-monospace, monospace; }
.df-root .font-geist-mono { font-family: 'Geist Mono', ui-monospace, monospace; }

.df-root .df-badge { border: 1px solid var(--df-badge-border); color: var(--df-muted); }
.df-root .df-sep { background: var(--df-border); }
.df-root .df-label { letter-spacing: 0.2em; }
.df-root .df-focus:focus-visible {
  outline: 2px solid var(--df-accent);
  outline-offset: 2px;
}

.df-field { position: absolute; inset: 0; }
.df-field.df-lit {
  -webkit-mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
  mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
}
.df-dots {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: calc(100% + 360px);
  background: var(--df-accent);
  -webkit-mask-image: ${GRID}, ${DITHER};
  mask-image: ${GRID}, ${DITHER};
  -webkit-mask-size: 4px 4px, 360px 240px;
  mask-size: 4px 4px, 360px 240px;
  -webkit-mask-repeat: repeat, repeat-x;
  mask-repeat: repeat, repeat-x;
  -webkit-mask-position: 0 0, left bottom;
  mask-position: 0 0, left bottom;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
@media (prefers-reduced-motion: no-preference) {
  .df-dots { animation: df-drift 40s linear infinite; }
  @supports (animation-timeline: view()) {
    .df-band { view-timeline: --df-band; }
    .df-mark { animation: df-rise linear both; animation-timeline: --df-band; animation-range: entry 20% entry 100%; }
  }
}
@keyframes df-drift { to { translate: -360px 0; } }
@keyframes df-rise { from { translate: 0 30%; } }
@media (min-width: 768px) {
  .df-grid { grid-template-columns: minmax(0, 2fr) repeat(4, minmax(0, 1fr)); }
}
.df-static .df-dots, .df-static .df-mark { animation: none !important; }
.df-fade {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 60%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 60%);
}
`;

/* ------------------------------------------------------------------ */
/*  DitheredFooter                                                     */
/* ------------------------------------------------------------------ */

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; href?: string; links: FooterLink[] };

export type DitheredFooterProps = {
  brand?: string;
  brandHref?: string;
  tagline?: string;
  columns?: FooterColumn[];
  accent?: string;
  badge?: string;
  animated?: boolean;
};

const toLinks = (labels: string[]): FooterLink[] =>
  labels.map((label) => ({ label, href: "/" + label.toLowerCase().replace(/\s+/g, "-") }));

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Product", links: toLinks(["Features", "Pricing", "Changelog", "Roadmap"]) },
  { title: "Resources", links: toLinks(["Docs", "Guides", "Community", "Blog"]) },
  { title: "Company", links: toLinks(["About", "Careers", "Contact", "Press"]) },
];

export function DitheredFooter({
  brand = "Acme",
  brandHref = "/",
  tagline = "Tools for teams who ship. Built in the open, one release at a time.",
  columns = DEFAULT_COLUMNS,
  accent = "#ff6a00",
  animated = true,
  badge,
}: DitheredFooterProps) {
  useGoogleFonts();
  const dark = useDarkMode();
  const gridColor = dark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";

  return (
    <footer
      className={`df-root overflow-hidden${animated ? "" : " df-static"}`}
      style={{ "--df-accent": accent, backgroundColor: "var(--df-background)", color: "var(--df-foreground)" } as React.CSSProperties}
    >
      <style>{STYLES}</style>

      <div className="df-grid mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 border-t px-6 pb-4 pt-16 sm:gap-x-10 sm:px-8" style={{ borderColor: "var(--df-border)" }}>
        <div className="col-span-2 w-fit md:col-span-1">
          <div className="flex items-center gap-2">
            <a href={brandHref} className={`font-kode-mono df-focus rounded-sm text-2xl font-normal tracking-tight`}>
              {brand}
            </a>
            {badge && <Badge className="font-geist-pixel rounded-sm">{badge}</Badge>}
          </div>
          <Separator className="mt-4 w-full" />
          <p className="font-geist-pixel mt-4 max-w-xs text-sm leading-relaxed tracking-widest" style={{ color: "var(--df-muted)" }}>
            {tagline}
          </p>
        </div>

        {columns.map((col, index) => (
          <div key={`${col.title}-${index}`}>
            <p className="font-geist-mono df-label text-xs font-medium uppercase" style={{ color: "var(--df-muted)" }}>
              {col.title}
            </p>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <AnimatedLink variant="center" className="font-geist-pixel cursor-default text-lg font-normal">
                    {l.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Spark band below the link columns */}
      <div aria-hidden="true" className="df-band relative h-60 overflow-hidden">
        <div className="df-field">
          <FlickeringGrid
            className="absolute inset-0 df-fade"
            color={gridColor}
            flickerChance={animated ? 0.3 : 0}
            topScatter={0.85}
          />
        </div>
      </div>
    </footer>
  );
}

export default DitheredFooter;

/* ------------------------------------------------------------------ */
/*  KONSOL EXPRESS data (drop-in content)                              */
/* ------------------------------------------------------------------ */

export const FooterSection = () => (
  <DitheredFooter
    brand="KONSOL EXPRESS"
    brandHref="/"
    badge="Beta"
    tagline="where we left the game"
    accent="#ff6a00"
    columns={[
      {
        title: "Playstation",
        links: [
          { label: "Consoles", href: "#" },
          { label: "Games", href: "#" },
          { label: "Controllers", href: "#" },
          { label: "PS VR2", href: "#" },
          { label: "PS Plus", href: "#" },
        ],
      },
      {
        title: "Xbox",
        links: [
          { label: "Series X", href: "#" },
          { label: "Series S", href: "#" },
          { label: "Wireless", href: "#" },
          { label: "Game Pass", href: "#" },
          { label: "Headsets", href: "#" },
        ],
      },
      {
        title: "Dualsense",
        links: [
          { label: "Edge", href: "#" },
          { label: "Charging", href: "#" },
          { label: "Grips", href: "#" },
          { label: "Skins", href: "#" },
          { label: "Cases", href: "#" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "About Us", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Support", href: "#" },
          { label: "FAQ", href: "#" },
          { label: "Warranty", href: "#" },
        ],
      },
    ]}
  />
);
