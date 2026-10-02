import React from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import CrispChat from "@/components/crisp-chat";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const notoSerifHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "700"
});

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || "https://shadcnuidashboard.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth antialiased", notoSerifHeading.variable, "font-sans", inter.variable)}
      suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
        <CrispChat />
      </body>
    </html>
  );
}
