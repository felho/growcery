import { DeleteDialog } from "../../_components/delete-dialog";

interface DeleteUserDialogProps {
  onDelete: () => void;
  className?: string;
}

export function DeleteUserDialog({
  onDelete,
  className,
}: DeleteUserDialogProps) {
  return (
    <DeleteDialog
      onDelete={onDelete}
      className={className}
      description="This action cannot be undone. This will permanently delete the user."
    />
  );
}
