"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check as CheckIcon
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyPnpmInstallButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
      {copied ? (
        <HugeiconsIcon icon={CheckIcon} className="size-3.5 text-green-500" />
      ) : null}
      {copied ? "Copied!" : "Copy pnpm"}
    </Button>
  );
}
