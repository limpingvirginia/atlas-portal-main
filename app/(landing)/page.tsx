import { Metadata } from "next";
import { HeroSection } from "@/components/layout/landing/sections/hero";
import TechStack from "@/components/layout/components/tech-stack";
import Testimonials from "@/components/layout/components/testimonials";
import Features from "@/components/layout/components/features";
import Showcase from "@/components/layout/components/showcase";
import Explore from "@/components/layout/components/explore";
import FAQ from "@/components/layout/components/faq";
import CTA from "@/components/layout/components/cta";

export const metadata: Metadata = {
  title: `The Ultimate Shadcn UI Admin Dashboard Template`,
  description:
    "Admin dashboard template built with Shadcn UI, Tailwind CSS and Next.js (React) to quickly start your project. Contains Typescript files.",
  openGraph: {
    images: [
      {
        url: "/og-image.png"
      }
    ]
  }
};

export default function Page() {
  return (
    <main className="divide-y">
      <HeroSection />
      <TechStack />
      <Features />
      <Showcase />
      <Explore />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
