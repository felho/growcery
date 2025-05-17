"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteUserArchetypeAction } from "~/server/actions/user-archetypes/delete";
import { toast } from "sonner";

interface DeleteArchetypeDialogProps {
  onDelete: () => void;
  className?: string;
  archetypeId: number;
}

export function DeleteArchetypeDialog({
  onDelete,
  className,
  archetypeId,
}: DeleteArchetypeDialogProps) {
  const { execute: deleteArchetype } = useAction(deleteUserArchetypeAction, {
    onSuccess: () => {
      toast.success("Archetype deleted successfully");
      onDelete();
    },
    onError: () => toast.error("Failed to delete archetype"),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`text-destructive bg-destructive/10 hover:bg-destructive/20 ${className ?? ""}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            archetype.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteArchetype({ id: archetypeId })}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
