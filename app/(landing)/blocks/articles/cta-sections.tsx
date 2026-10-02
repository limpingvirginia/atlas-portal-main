export function CtaSections() {
  return (
    <>
      <p>
        CTA (call-to-action) section blocks are shadcn blocks focused on a
        single conversion goal: sign up, buy, download, or contact. They use
        shadcn/ui Button and Card components styled with Tailwind CSS and are
        implemented in React and TypeScript. Each block provides a clear
        headline, optional short copy, and one or more primary actions, with
        layout and hierarchy already defined so you can plug them in quickly.
      </p>
      <p>
        Typical use cases include the end of feature or pricing sections,
        before the footer, in the middle of long landing pages, or in email
        capture flows. They work in Next.js app or page routes, in marketing
        sites, SaaS dashboards, and docs, anywhere you need a focused “next
        step” without designing a full section from scratch. You can repeat
        different CTA blocks on the same page for A/B testing or distinct
        offers.
      </p>
      <p>
        Customization is straightforward: text, button labels, and links are
        in your codebase. Tailwind classes control spacing, colors, and
        responsiveness; you can switch variants (e.g. outline vs solid buttons)
        or add icons. The blocks are composable with other shadcn components
        and support light and dark themes, so they stay consistent with the
        rest of your shadcn UI and design system.
      </p>
    </>
  );
}
