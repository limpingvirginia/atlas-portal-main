"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Plus,
  Users,
  X
} from "@hugeicons/core-free-icons";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { createTeam } from "./actions";

export default function CreateTeamDialog({ maxMembers }: { maxMembers: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const updateEmail = (index: number, value: string) => {
    setEmails((prev) => prev.map((email, i) => (i === index ? value : email)));
  };

  const addEmailRow = () => {
    if (emails.length < maxMembers) setEmails((prev) => [...prev, ""]);
  };

  const removeEmailRow = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createTeam(
        name,
        emails.map((email) => email.trim()).filter(Boolean)
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Team created. Invitations are on their way");
        setOpen(false);
        setName("");
        setEmails([""]);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={Users} className="size-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Team</DialogTitle>
          <DialogDescription>
            Name your team and invite members by email. Each member receives a one-click sign-in
            link and gets access to all your products.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              required
              maxLength={50}
              placeholder="e.g. Acme Design Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Member emails</Label>
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder={`member${index + 1}@example.com`}
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                  />
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmailRow(index)}>
                      <HugeiconsIcon icon={X} className="size-4" />
                      <span className="sr-only">Remove email</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
              disabled={emails.length >= maxMembers}
              onClick={addEmailRow}>
              <HugeiconsIcon icon={Plus} className="size-4" />
              Add another email
            </Button>
            <p className="text-muted-foreground text-xs">
              Up to {maxMembers} members. You can also add members later.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner className="size-4" /> : null}
            Create Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
