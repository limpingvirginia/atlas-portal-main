"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Trash2
} from "@hugeicons/core-free-icons";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteLicense } from "./actions";

export default function DeleteLicenseButton({ licenseId }: { licenseId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteLicense(licenseId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("License key deleted");
      }
    });
  };

  return (
    <Button variant="ghost" size="icon" disabled={isPending} onClick={handleDelete}>
      <HugeiconsIcon icon={Trash2} className="size-4" />
      <span className="sr-only">Delete license key</span>
    </Button>
  );
}
