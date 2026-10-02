export type Release = {
  version: string;
  date: string;
  title: string;
  changes: { type: "Added" | "Improved" | "Fixed"; text: string }[];
};

/** Newest release first — the hero badge reads releases[0]. */
export const releases: Release[] = [
  {
    version: "v1.1.0",
    date: "August 2026",
    title: "Blocks library",
    changes: [
      { type: "Added", text: "Blocks library with copy-paste sections for any shadcn/ui project" },
      { type: "Added", text: "Calendar, kanban and chat page templates" },
      { type: "Fixed", text: "Sidebar collapse state persisting across navigation" }
    ]
  },
  {
    version: "v1.0.0",
    date: "July 2026",
    title: "Initial release",
    changes: [
      { type: "Added", text: "50+ themed shadcn/ui components and 15 page templates" },
      { type: "Added", text: "Analytics and CRM dashboards, auth flows, settings pages" },
      { type: "Added", text: "Light & dark themes with the monochrome design system" }
    ]
  }
];
