"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  LoaderCircle as Loader2
} from "@hugeicons/core-free-icons";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const GOOGLE_FONTS = new Set(["Inter", "Roboto", "Poppins", "Nunito", "DM Sans"]);

function applyFontFamily(fontFamily: string, root: HTMLElement) {
  let cssValue: string;
  if (fontFamily === "sans") {
    cssValue = "ui-sans-serif, system-ui, sans-serif";
  } else if (fontFamily === "serif") {
    cssValue = "ui-serif, Georgia, Cambria, serif";
  } else if (fontFamily === "mono") {
    cssValue = "ui-monospace, 'Courier New', monospace";
  } else if (GOOGLE_FONTS.has(fontFamily)) {
    const id = `gfont-${fontFamily.replace(/\s+/g, "-")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
    cssValue = `'${fontFamily}', sans-serif`;
  } else {
    cssValue = `'${fontFamily}', sans-serif`;
  }
  root.style.fontFamily = cssValue;
}

export default function DemoPageGenerator() {
  const [isTopLevel, setIsTopLevel] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get("path");
    const iframeId = path ? path.split("/").filter(Boolean).at(-1) : null;

    const measure = () => {
      const wrapper = document.getElementById("demo-wrapper");
      const height = wrapper ? wrapper.scrollHeight : document.body.scrollHeight;
      window.parent.postMessage({ type: "setHeight", height, iframeId }, "*");
    };

    const sendHeight = () => requestAnimationFrame(measure);

    sendHeight();
    const interval = setInterval(measure, 300);
    setTimeout(() => clearInterval(interval), 2000);

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.getElementById("demo-wrapper") ?? document.body);

    window.addEventListener("resize", sendHeight);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener("resize", sendHeight);
    };
  }, []);

  useEffect(() => {
    // true when NOT in an iframe
    setIsTopLevel(window.top === window.self);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data;
      if (!data?.type) return;
      const root = document.documentElement;
      if (data.type === "theme") {
        root.classList.toggle("dark", data.value === "dark");
      } else if (data.type === "theme-colors") {
        Object.entries(data.colors as Record<string, string>).forEach(([k, v]) =>
          root.style.setProperty(k, v)
        );
      } else if (data.type === "theme-typography") {
        const t = data.typography as Record<string, string>;
        if (t.fontFamily) applyFontFamily(t.fontFamily, root);
        if (t.fontSizeBase) root.style.fontSize = t.fontSizeBase;
        if (t.lineHeight) root.style.lineHeight = t.lineHeight;
        if (t.fontWeightNormal) root.style.setProperty("--font-weight-normal", t.fontWeightNormal);
        if (t.fontWeightBold) root.style.setProperty("--font-weight-bold", t.fontWeightBold);
      } else if (data.type === "theme-spacing") {
        const s = data.spacing as Record<string, string>;
        if (s.baseSpacingUnit) root.style.setProperty("--spacing", s.baseSpacingUnit);
      } else if (data.type === "theme-others") {
        const o = data.others as Record<string, string>;
        if (o.radius) root.style.setProperty("--radius", o.radius);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const pathParam = searchParams.get("path");
  if (!pathParam) return null;

  // path like "/blocks/charts/1" → parts = ["blocks","charts","1"]
  const parts = pathParam.split("/").filter(Boolean);
  const compKey = parts.at(-1);

  let Component: React.ComponentType | null = null;

  if (parts.length === 3) {
    const [page, component] = parts;
    Component = dynamic(
      () => import(`@/app/(landing)/blocks/contents/${page}/${component}/${compKey}/index`),
      { ssr: true }
    );
  }

  const responsive = searchParams.get("responsive") === "true";
  const customHeight = searchParams.get("height");
  const customStyle = searchParams.get("customStyle") === "true";

  return (
    <div
      id="demo-wrapper"
      className={cn("items-center justify-center", {
        "bg-muted/60 px-4 lg:px-8 py-4 lg:py-10": customStyle,
        "md:flex": responsive,
        flex: !responsive
      })}>
      <div
        className={cn({
          "w-full": pathParam.includes("blocks/")
        })}
        style={customHeight ? { height: Number(customHeight) } : undefined}>
        <Suspense
          fallback={
            <div className="flex h-32 items-center justify-center">
              <HugeiconsIcon icon={Loader2} className="text-muted-foreground size-5 animate-spin" />
            </div>
          }>
          {Component ? (
            <Component />
          ) : (
            <div className="text-muted-foreground p-8 text-sm">Component not found</div>
          )}
        </Suspense>
      </div>
      {isTopLevel && (
        <div className="text-muted-foreground fixed bottom-4 left-4 z-50 text-xs">Preview mode</div>
      )}
    </div>
  );
}
