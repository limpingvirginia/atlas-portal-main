"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  KeyRound,
  Plus
} from "@hugeicons/core-free-icons";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { createLicense } from "./actions";

export default function CreateLicenseDialog({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createLicense(name);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("License key created");
        setName("");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <HugeiconsIcon icon={Plus} className="size-4" />
          New License Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={KeyRound} className="size-4" />
            New License Key
          </DialogTitle>
          <DialogDescription>
            Give your license key a name so you can recognize it later, for example the project
            or machine you&apos;ll use it on. The key is generated automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="license-name">Name</Label>
            <Input
              id="license-name"
              required
              maxLength={50}
              autoComplete="off"
              placeholder="e.g. My SaaS Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner className="size-4" /> : null}
            Create License Key
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
