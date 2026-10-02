"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

const CRISP_WEBSITE_ID =
  process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? "ad7eb1e4-d1cc-42a4-920a-2defe8707bd4";

export default function CrispChat() {
  const pathname = usePathname();
  // Block previews render inside iframes on /demo — no chat bubble there
  const isEmbedded = pathname?.startsWith("/demo");

  useEffect(() => {
    if (isEmbedded || !CRISP_WEBSITE_ID || window.$crisp) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, [isEmbedded]);

  return null;
}
