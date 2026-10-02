"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleCheck
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useThanksDialogStore } from "@/store/thanks-dialog-store";

export default function ThanksDialog() {
  const { open, toggleOpen } = useThanksDialogStore();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && toggleOpen()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <HugeiconsIcon icon={CircleCheck} className="mb-2 size-12 text-emerald-500" />
          <DialogTitle>Thank you for your purchase! 🎉</DialogTitle>
          <DialogDescription>
            Your order is confirmed and a confirmation email is on its way. You can access your
            products and generate license keys from your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button asChild onClick={() => toggleOpen()}>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="ghost" onClick={() => toggleOpen()}>
            Continue browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
