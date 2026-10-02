"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Trash2
} from "@hugeicons/core-free-icons";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteTeam } from "./actions";

export default function DeleteTeamButton({ teamId }: { teamId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTeam(teamId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Team deleted");
        router.refresh();
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isPending}>
          <HugeiconsIcon icon={Trash2} className="size-4" />
          <span className="sr-only">Delete team</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this team?</AlertDialogTitle>
          <AlertDialogDescription>
            All members will be removed and their team-based access will be revoked, including
            GitHub repository access, accounts created through this team, and their license keys.
            This cannot be undone. Your own license stays and you can create a new team later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete Team</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
