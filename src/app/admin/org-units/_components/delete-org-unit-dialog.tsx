"use client";

import { DeleteDialog } from "../../_components/delete-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteOrgUnitAction } from "~/server/actions/org-unit/delete";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

interface DeleteOrgUnitDialogProps {
  onDelete: () => void;
  className?: string;
  orgUnitId: number;
  parentId?: number | null;
}

export function DeleteOrgUnitDialog({
  onDelete,
  className,
  orgUnitId,
  parentId,
}: DeleteOrgUnitDialogProps) {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { execute: deleteOrgUnit } = useAction(deleteOrgUnitAction, {
    onSuccess: () => {
      toast.success("Organizational unit deleted successfully");
      // Invalidate the org units cache to trigger a refetch
      void mutate("/org-units");
      // If there's a parent, redirect to maintain the tree's open state
      if (parentId) {
        router.push(`/admin/org-units?highlightId=${parentId}`);
      } else {
        router.refresh();
      }
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
