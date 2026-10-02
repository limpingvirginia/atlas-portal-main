"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check as CheckIcon,
  CopyIcon
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CopyToClipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-zinc-400 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? (
            <HugeiconsIcon icon={CheckIcon} className="size-3.5 text-green-400" />
          ) : (
            <HugeiconsIcon icon={CopyIcon} className="size-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
    </Tooltip>
  );
}
