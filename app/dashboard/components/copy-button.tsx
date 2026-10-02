"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Check,
  Copy
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}>
      {copied ? <HugeiconsIcon icon={Check} className="size-4 text-emerald-600" /> : <HugeiconsIcon icon={Copy} className="size-4" />}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
