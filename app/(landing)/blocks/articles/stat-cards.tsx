export function StatCards() {
  return (
    <>
      <p>
        Stat card blocks are shadcn blocks that show a single metric: value,
        label, optional trend or delta, and sometimes a small chart or icon.
        Built with React and TypeScript, they use shadcn/ui Card and
        typography components styled with Tailwind CSS. Each block gives you a
        repeatable KPI or metric tile for dashboards and reports.
      </p>
      <p>
        They are for admin panels, SaaS dashboards, and analytics pages. Use
        them in a grid on the main dashboard or in section headers. They work
        in Next.js and other React apps alongside charts and tables and
        support light and dark themes so metrics stay on-brand.
      </p>
      <p>
        Value, label, and trend are in your code or API. Tailwind controls
        card style, spacing, and layout. You can add sparklines, icons, or
        links; the underlying shadcn UI structure stays the same so you keep
        full control and can reuse the same block across many metrics.
      </p>
    </>
  );
}
