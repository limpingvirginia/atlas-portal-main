"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  TabletIcon
} from "@hugeicons/core-free-icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type ViewportDevice,
  useComponentDevicePreviewStore,
} from "@/store/component-device-preview";

const devices: { key: ViewportDevice; icon: React.ReactNode; label: string }[] = [
  { key: "mobile", icon: <HugeiconsIcon icon={SmartphoneIcon} className="size-4" />, label: "Mobile" },
  { key: "tablet", icon: <HugeiconsIcon icon={TabletIcon} className="size-4" />, label: "Tablet" },
  { key: "desktop", icon: <HugeiconsIcon icon={MonitorIcon} className="size-4" />, label: "Desktop" },
];

export default function ViewportToolbar({ componentId }: { componentId: string }) {
  // Must select the resolved device string — `s.getDevice` alone is a stable ref and won't re-render.
  const current = useComponentDevicePreviewStore((s) => s.getDevice(componentId));
  const setDevice = useComponentDevicePreviewStore((s) => s.setDevice);

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={current}
      onValueChange={(val) => val && setDevice(componentId, val as ViewportDevice)}
    >
      {devices.map(({ key, icon, label }) => (
        <Tooltip key={key}>
          <TooltipTrigger asChild>
            <ToggleGroupItem value={key} aria-label={label}>
              {icon}
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}
