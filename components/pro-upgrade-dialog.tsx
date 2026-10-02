import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  ChevronRight
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";

export function ProUpgradeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon icon={LockIcon} className="size-4" /> Get the Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <VisuallyHidden.Root>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </VisuallyHidden.Root>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon icon={LockIcon} className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-semibold">Pro Component</h3>
            <p className="text-muted-foreground text-sm">
              This block is part of the Pro plan. Upgrade to access all premium
              blocks, sections, and future additions.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/pricing">
              Unlock Pro Plan <HugeiconsIcon icon={ChevronRight} className="size-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
