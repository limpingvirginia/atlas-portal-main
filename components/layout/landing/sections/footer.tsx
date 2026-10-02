import Link from "next/link";
import Logo from "@/components/layout/logo";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/app/(landing)/blocks/categories";

export const FooterSection = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Logo className="mb-4 flex items-center gap-2" />
            <p className="text-muted-foreground text-sm text-balance">
              The most comprehensive and modern admin dashboard template. Built with React,
              TypeScript, and Tailwind CSS for maximum performance and customization. shadcn/ui is
              compatible.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Blocks</h3>
            <ul className="text-muted-foreground space-y-2">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="hover:text-primary text-sm transition-colors hover:underline">
                    {category.sidebarTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Sources</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary text-sm transition-colors hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/ecommerce"
                  className="hover:text-primary text-sm transition-colors hover:underline">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="hover:text-primary text-sm transition-colors hover:underline">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/updates"
                  className="hover:text-primary text-sm transition-colors hover:underline">
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <Link href="/licenses" className="text-sm transition-colors">
                  Licenses
                </Link>
              </li>
              <li className="hover:text-primary cursor-pointer text-sm transition-colors hover:underline">
                <Link href="/privacy-policy" className="transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="hover:text-primary cursor-pointer text-sm transition-colors hover:underline">
                <Link href="/terms-conditions" className="transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      <div className="text-muted-foreground mx-auto max-w-7xl px-4 py-4 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Shadcn UI Dashboard. All rights reserved.</p>
      </div>
    </footer>
  );
};
