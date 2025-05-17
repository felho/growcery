import { DeleteDialog } from "../../_components/delete-dialog";

interface DeleteFunctionDialogProps {
  onDelete: () => void;
  className?: string;
}

export function DeleteFunctionDialog({
  onDelete,
  className,
}: DeleteFunctionDialogProps) {
  return (
    <DeleteDialog
      onDelete={onDelete}
      className={className}
      description="This action cannot be undone. This will permanently delete the function."
    />
  );
}
