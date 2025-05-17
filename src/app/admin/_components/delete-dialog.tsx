import { Button } from "~/components/ui/button";
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
import { X } from "lucide-react";

interface DeleteDialogProps {
  onDelete: () => void;
  className?: string;
  title?: string;
  description?: string;
}

export function DeleteDialog({
  onDelete,
  className,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className={`cursor-pointer ${className ?? ""}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
