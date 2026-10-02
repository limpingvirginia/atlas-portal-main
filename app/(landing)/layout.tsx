import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/landing/navbar";
import { FooterSection } from "@/components/layout/landing/sections/footer";
import GoogleAnalyticsInit from "@/lib/ga";

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  // Session is read on the server so the navbar's account state renders with
  // the initial HTML instead of popping in after the client fetch
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <Navbar initialUser={session?.user ?? null} />
      {children}
      <FooterSection />
      {process.env.NODE_ENV === "production" ? <GoogleAnalyticsInit /> : null}
    </>
  );
}
