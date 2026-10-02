"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GroupImperativeHandle } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  type ViewportDevice,
  useComponentDevicePreviewStore
} from "@/store/component-device-preview";
import { useBlockThemeStore } from "@/store/block-theme";
import { buildThemeMessagesFromState } from "@/app/generator/lib/build-theme-messages";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const VIEWPORT_WIDTH: Record<ViewportDevice, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 0
};

const PRESET_TOLERANCE_PX = 4;

const PANEL_MAIN_ID = "main";
const PANEL_SPACER_ID = "spacer";

type ComponentIframeProps = {
  id: number | string;
  url?: string;
  viewportKey?: string;
  contentPadding?: boolean;
};

export default function ComponentIframe({
  id,
  url,
  viewportKey,
  contentPadding
}: ComponentIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelGroupRef = useRef<GroupImperativeHandle | null>(null);
  const device = useComponentDevicePreviewStore((s) =>
    viewportKey ? s.getDevice(viewportKey) : "desktop"
  );
  const setDevice = useComponentDevicePreviewStore((s) => s.setDevice);

  const searchParams = (() => {
    if (!url) return null;
    const query = url.split("?")[1];
    return query ? new URLSearchParams(query) : null;
  })();
  const customHeight = searchParams?.get("height");
  const responsive = searchParams?.get("responsive") !== "false";
  const isMobile = useIsMobile();

  const [height, setHeight] = useState(customHeight ? `${customHeight}px` : "300px");
  const [isReady, setIsReady] = useState(Boolean(customHeight));

  const applyDeviceLayout = useCallback((targetDevice: ViewportDevice) => {
    const container = containerRef.current;
    const panelGroup = panelGroupRef.current;
    if (!container?.offsetWidth || !panelGroup) return;

    const targetPx =
      VIEWPORT_WIDTH[targetDevice] === 0 ? container.offsetWidth : VIEWPORT_WIDTH[targetDevice];
    const percent = Math.min((targetPx / container.offsetWidth) * 100, 100);
    panelGroup.setLayout({
      [PANEL_MAIN_ID]: percent,
      [PANEL_SPACER_ID]: 100 - percent
    });
  }, []);

  useEffect(() => {
    applyDeviceLayout(device);
  }, [device, applyDeviceLayout]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (
        data?.type === "setHeight" &&
        typeof data.height === "number" &&
        String(data.iframeId) === String(id)
      ) {
        setHeight(`${data.height}px`);
        setIsReady(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [id]);

  const { resolvedTheme } = useTheme();
  const pageThemeSave = useBlockThemeStore((s) => s.pageThemeSave);
  const darkModeByKey = useBlockThemeStore((s) => s.darkModeByKey);
  const darkModeOverride = viewportKey ? darkModeByKey[viewportKey] : undefined;

  useEffect(() => {
    if (!isReady) return;
    const win = iframeRef.current?.contentWindow;
    if (!win || !resolvedTheme) return;

    const isDark = darkModeOverride ?? resolvedTheme === "dark";

    if (pageThemeSave) {
      buildThemeMessagesFromState(pageThemeSave.state, isDark).forEach((msg) =>
        win.postMessage(msg, "*")
      );
    } else {
      win.postMessage({ type: "theme", value: isDark ? "dark" : "light" }, "*");
    }
  }, [pageThemeSave, darkModeOverride, resolvedTheme, isReady]);

  const handleLayout = useCallback(
    (layout: { [panelId: string]: number }) => {
      if (!viewportKey || !containerRef.current) return;
      const containerW = containerRef.current.offsetWidth;
      const mainPercent = layout[PANEL_MAIN_ID] ?? 100;
      const spacerPercent = layout[PANEL_SPACER_ID] ?? 0;
      const px = Math.round((mainPercent / 100) * containerW);

      // Full-width layout: spacer is ~0. If we only match px to preset widths, a
      // ~768px or ~375px *container* wrongly maps to tablet/mobile and overwrites
      // an explicit "desktop" selection from the toolbar (width looks unchanged).
      const hasSpacer = spacerPercent > 0.5;
      if (!hasSpacer && mainPercent > 99) {
        setDevice(viewportKey, "desktop");
        return;
      }

      const match = (["mobile", "tablet", "desktop"] as const).find(
        (key) =>
          VIEWPORT_WIDTH[key] !== 0 && Math.abs(VIEWPORT_WIDTH[key] - px) < PRESET_TOLERANCE_PX
      );
      if (match) {
        setDevice(viewportKey, match);
      } else if (mainPercent > 99) {
        setDevice(viewportKey, "desktop");
      }
    },
    [viewportKey, setDevice]
  );

  return (
    <div ref={containerRef} className="mx-auto w-full border-t transition-[max-width] duration-200">
      <ResizablePanelGroup
        groupRef={panelGroupRef}
        orientation="horizontal"
        className="w-full overflow-visible! rounded-lg border-e-0"
        onLayoutChanged={handleLayout}>
        <ResizablePanel
          id={PANEL_MAIN_ID}
          defaultSize={100}
          minSize={27}
          className={cn("-me-0.5 border-e")}>
          <div className="relative w-full" style={{ height }}>
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="size-5" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={url}
              className={cn("w-full", !isReady && "invisible")}
              style={{ height }}
            />
          </div>
        </ResizablePanel>
        {!isMobile && responsive && <ResizableHandle withHandle className="bg-transparent" />}
        <ResizablePanel id={PANEL_SPACER_ID} defaultSize={0} minSize={0} />
      </ResizablePanelGroup>
    </div>
  );
}
