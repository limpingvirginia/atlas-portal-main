"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ComponentScrollNav({ ids }: { ids: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  function scrollTo(index: number) {
    const id = ids[index];
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  if (ids.length <= 1) return null;

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < ids.length - 1;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-1.5 lg:right-6 lg:bottom-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="size-9 shadow-md"
            disabled={!hasPrev}
            onClick={() => scrollTo(activeIndex - 1)}
          >
            <HugeiconsIcon icon={ChevronUpIcon} className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          Previous ({activeIndex}/{ids.length})
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="size-9 shadow-md"
            disabled={!hasNext}
            onClick={() => scrollTo(activeIndex + 1)}
          >
            <HugeiconsIcon icon={ChevronDownIcon} className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          Next ({activeIndex + 2}/{ids.length})
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
