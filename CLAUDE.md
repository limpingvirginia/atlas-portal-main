# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server (Next.js 15)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Architecture

This is a **Next.js 15 App Router** marketing/landing site for a shadcn-ui Admin Dashboard Template, using React 19, TypeScript, and Tailwind CSS 4.

### Directory Structure

- **`/app`** — App Router pages: homepage, `/pricing`, `/roadmap`, `/contact`, and legal pages. Root layout at `app/layout.tsx` sets up fonts (Cal_Sans for headings, Plus Jakarta Sans for body), navbar, footer, and analytics.
- **`/components/layout`** — Landing page sections (hero, features, testimonials, pricing blocks, navbar, footer)
- **`/components/ui`** — 50+ shadcn/ui components (Radix UI-based primitives)
- **`/@data`** — Static data files (features, pricing, FAQs, reviews, component nav) as `.ts`/`.json`
- **`/lib`** — Utilities: `utils.ts` (clsx/twMerge), `generate-meta.ts`, `products.ts`, `ga.ts` (Google Analytics)
- **`/hooks`** — `use-mobile.ts`, `use-paddle.ts` (Paddle payment), `use-toast.ts`
- **`/store`** — Zustand state management
- **`/config`** — Site configuration
- **`/enums`** — TypeScript enums

### Key Conventions

- Path alias `@/*` maps to the project root (e.g., `@/components/ui/button`)
- shadcn components are configured via `components.json` (RSC enabled, Hugeicons icons — lucide-react was removed)
- **Copywriting: never use em dashes (—) in user-facing text.** Rewrite with a period, comma, colon, or parentheses instead.
- Prettier config: 100-char line width, 2-space indent, Tailwind CSS plugin for class sorting
- ESLint extends `next/core-web-vitals`; `react-hooks/exhaustive-deps` and `react/no-children-prop` are disabled

### Payment & Analytics

- **Paddle** integration via `hooks/use-paddle.ts` for billing
- **Google Analytics 4** and **Umami** analytics; conditionally loaded in root layout
- Environment variables required — see `.env.local`

### Tech Stack

Tailwind CSS 4, shadcn/ui, Radix UI, React Hook Form + Zod, TanStack Table, Zustand, Recharts, Embla Carousel, dnd-kit, Motion (animations), Sonner (toasts), Lucide icons

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
