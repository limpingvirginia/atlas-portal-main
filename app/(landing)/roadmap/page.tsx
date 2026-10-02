import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckCircle,
  Clock,
  Lightbulb,
  Rocket
} from "@hugeicons/core-free-icons";

const Roadmap = () => {
  const roadmapItems = [
    {
      status: "in-progress",
      title: "Vite.js CRM Dashboard",
      description: "The same CRM experience, rebuilt on Vite for teams that prefer a SPA setup."
    },
    {
      status: "planned",
      title: "Blocks Page",
      description: "Plug-and-play blocks for advanced dashboard components: copy, paste, ship."
    },
    {
      status: "planned",
      title: "Analytics Dashboard",
      description: "Traffic, conversion and revenue insights with rich chart components."
    },
    {
      status: "planned",
      title: "Hospital Dashboard",
      description: "Patient management, appointments and staff scheduling for healthcare."
    },
    {
      status: "planned",
      title: "Project Management Dashboard",
      description: "Projects, tasks, timelines and team workload in one place."
    },
    {
      status: "planned",
      title: "Vue.js CRM Dashboard",
      description: "The CRM dashboard ported to Vue 3 with the same design system."
    },
    {
      status: "planned",
      title: "Svelte CRM Dashboard",
      description: "A Svelte take on the CRM dashboard for lighter, faster apps."
    },
    {
      status: "planned",
      title: "Figma Design Kit",
      description: "Every component and page as a Figma library, in sync with the code."
    },
    {
      status: "completed",
      title: "Next.js CRM Dashboard",
      description: "A full-featured CRM dashboard built with Next.js App Router and shadcn/ui."
    },
    {
      status: "completed",
      title: "Shadcn Admin v1.0 Launch",
      description: "The first stable release of Shadcn Admin, built with shadcn/ui and TypeScript."
    },
    {
      status: "completed",
      title: "Next.js Ecommerce Dashboard",
      description: "Orders, products, customers and revenue analytics for online stores."
    }
  ];

  const columns = [
    {
      status: "in-progress",
      title: "In Progress",
      dotClass: "bg-blue-500",
      icon: <HugeiconsIcon icon={Clock} className="size-5 text-blue-500" strokeWidth={2} />
    },
    {
      status: "planned",
      title: "Planned",
      dotClass: "bg-orange-500",
      icon: <HugeiconsIcon icon={Lightbulb} className="size-5 text-orange-500" strokeWidth={2} />
    },
    {
      status: "completed",
      title: "Completed",
      dotClass: "bg-green-500",
      icon: <HugeiconsIcon icon={CheckCircle} className="size-5 text-green-500" strokeWidth={2} />
    }
  ];

  const getItemsByStatus = (status: string) => {
    return roadmapItems.filter((item) => item.status === status);
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl px-4 py-16 lg:py-24">
          <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
            Product roadmap
          </p>
          <h1 className="font-heading mb-4 text-4xl md:text-5xl">Where the template is headed</h1>
          <p className="text-muted-foreground text-lg text-balance">
            We&#39;re constantly improving Shadcn UI Dashboard based on user feedback and industry
            trends. Here&#39;s what we&#39;ve accomplished and what&#39;s coming next.
          </p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 border-t md:grid-cols-3">
          {columns.map((column) => (
            <div
              key={column.status}
              className="border-e max-md:border-e-0 max-md:border-b max-md:last:border-b-0 md:last:border-e-0">
              {/* Column Header */}
              <div className="flex items-center gap-2.5 border-b p-4 lg:px-5">
                {column.icon}
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-muted-foreground ml-auto text-sm tabular-nums">
                  {getItemsByStatus(column.status).length}
                </span>
              </div>

              {/* Column Items */}
              <div className="space-y-4 p-4 lg:p-5">
                {getItemsByStatus(column.status).map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/40 rounded-2xl border p-5 transition-colors lg:p-6">
                    <div className="flex items-center gap-2.5">
                      <span className={`size-2 shrink-0 rounded-full ${column.dotClass}`} />
                      <h4 className="leading-tight font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
              Track record
            </p>
            <h2 className="font-heading mb-2 text-3xl">Continuous innovation</h2>
            <p className="text-muted-foreground text-lg">
              Our commitment to excellence drives constant improvement.
            </p>
          </div>

          <div className="grid grid-cols-2 border-y md:grid-cols-4">
            {[
              { value: "24+", label: "Updates Released" },
              { value: "150+", label: "Features Added" },
              { value: "5k+", label: "User Requests" },
              { value: "99%", label: "Uptime" }
            ].map((stat, index) => (
              <div
                key={index}
                className="border-e px-4 py-6 text-center last:border-e-0 max-md:[&:nth-child(-n+2)]:border-b max-md:[&:nth-child(2n)]:border-e-0">
                <div className="font-heading text-3xl tabular-nums">{stat.value}</div>
                <div className="text-muted-foreground mt-1 font-mono text-xs tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
