"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type Props = {
  purchaseId: string;
  filename: string;
};

export default function DownloadButton({ purchaseId, filename }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/download/${purchaseId}`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast.error(body?.error ?? "Download failed. Please try again later.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleDownload} disabled={loading}>
      {loading ? <Spinner className="size-4" /> : <HugeiconsIcon icon={Download} className="size-4" />}
      Download
    </Button>
  );
}
