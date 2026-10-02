import { DitheredFooter } from "@/components/ui/dithered-footer";
import { categories } from "@/app/(landing)/blocks/categories";

export const FooterSection = () => {
  return (
    <DitheredFooter
      brand="Shadcn UI"
      brandHref="/"
      tagline="The most comprehensive and modern admin dashboard template. Built with React, TypeScript, and Tailwind CSS."
      accent="#ff6a00"
      columns={[
        {
          title: "Blocks",
          links: categories.map((category) => ({
            label: category.sidebarTitle,
            href: category.href,
          })),
        },
        {
          title: "Sources",
          links: [
            { label: "Pricing", href: "/pricing" },
            { label: "Live Demo", href: "/ecommerce" },
            { label: "Roadmap", href: "/roadmap" },
            { label: "Updates", href: "/updates" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Licenses", href: "/licenses" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-conditions" },
          ],
        },
      ]}
      legal={[
        { label: "Privacy", href: "/privacy-policy" },
        { label: "Terms", href: "/terms-conditions" },
      ]}
      copyright={`© ${new Date().getFullYear()} Shadcn UI Dashboard. All rights reserved.`}
      status={{
        label: "All systems normal",
        href: "/",
      }}
    />
  );
};
