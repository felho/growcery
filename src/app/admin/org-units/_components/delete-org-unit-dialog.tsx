"use client";

import { DeleteDialog } from "../../_components/delete-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteOrgUnitAction } from "~/server/actions/org-units/delete";
import { toast } from "sonner";

interface DeleteOrgUnitDialogProps {
  onDelete: () => void;
  className?: string;
  orgUnitId: number;
}

export function DeleteOrgUnitDialog({
  onDelete,
  className,
  orgUnitId,
}: DeleteOrgUnitDialogProps) {
  const { execute: deleteOrgUnit } = useAction(deleteOrgUnitAction, {
    onSuccess: () => {
      toast.success("Organizational unit deleted successfully");
      onDelete();
    },
    onError: () => toast.error("Failed to delete organizational unit"),
  });

  return (
    <DeleteDialog
      onDelete={() => deleteOrgUnit({ id: orgUnitId })}
      className={className}
      description="This action cannot be undone. This will permanently delete the organizational unit and all its sub-units."
    />
  );
}
