"use client";

import { DeleteDialog } from "../../_components/delete-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteUserArchetypeAction } from "~/server/actions/user-archetype/delete";
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
    <DeleteDialog
      onDelete={() => deleteArchetype({ id: archetypeId })}
      className={className}
      description="This action cannot be undone. This will permanently delete the archetype."
    />
  );
}
