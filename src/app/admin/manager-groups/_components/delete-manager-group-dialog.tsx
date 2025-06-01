"use client";

import { DeleteDialog } from "../../_components/delete-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteManagerGroupAction } from "~/server/actions/manager-group";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

interface DeleteManagerGroupDialogProps {
  onDelete: () => void;
  className?: string;
  managerGroupId: number;
}

export function DeleteManagerGroupDialog({
  onDelete,
  className,
  managerGroupId,
}: DeleteManagerGroupDialogProps) {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { execute: deleteManagerGroup } = useAction(deleteManagerGroupAction, {
    onSuccess: (args) => {
      toast.success(args.data?.message || "Manager group deleted successfully");
      // Invalidate the manager groups cache to trigger a refetch
      void mutate("managerGroups");
      router.refresh();
      onDelete();
    },
    onError: () => toast.error("Failed to delete manager group"),
  });

  return (
    <DeleteDialog
      onDelete={() => deleteManagerGroup({ id: managerGroupId })}
      className={className}
      description="This action cannot be undone. This will permanently delete the manager group and remove all member associations."
    />
  );
}
