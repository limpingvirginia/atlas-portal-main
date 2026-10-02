"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Trash2,
  UserPlus
} from "@hugeicons/core-free-icons";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { addTeamMember, removeTeamMember } from "./actions";
import type { TeamMember } from "@/lib/account";

type Props = {
  teamId: string;
  ownerEmail: string | null;
  members: TeamMember[];
  canManage: boolean;
};

export default function TeamMembers({ teamId, ownerEmail, members, canManage }: Props) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = (formData: FormData) => {
    startTransition(async () => {
      const result = await addTeamMember(teamId, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Member added");
        setEmail("");
      }
    });
  };

  const handleRemove = (memberId: string) => {
    startTransition(async () => {
      await removeTeamMember(teamId, memberId);
      toast.success("Member removed");
    });
  };

  return (
    <div className="space-y-4">
      <ul className="divide-y rounded-lg border">
        {ownerEmail && (
          <li className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm">{ownerEmail}</span>
            <Badge variant="secondary">Owner</Badge>
          </li>
        )}
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm">{member.email}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Member</Badge>
              {canManage && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() => handleRemove(member.id)}>
                  <HugeiconsIcon icon={Trash2} className="size-4" />
                  <span className="sr-only">Remove member</span>
                </Button>
              )}
            </div>
          </li>
        ))}
        {members.length === 0 && !ownerEmail && (
          <li className="text-muted-foreground px-3 py-2.5 text-sm">No members yet</li>
        )}
      </ul>

      {canManage && (
        <form action={handleAdd} className="flex gap-2">
          <Input
            type="email"
            name="email"
            required
            placeholder="member@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={isPending}>
            <HugeiconsIcon icon={UserPlus} className="size-4" />
            Add
          </Button>
        </form>
      )}
    </div>
  );
}
