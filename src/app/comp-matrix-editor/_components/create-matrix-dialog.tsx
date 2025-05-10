import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Function } from "~/server/queries/function";
import { createCompMatrix } from "~/lib/client-api/comp-matrix";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateMatrixDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  functions: Function[];
  newMatrix: {
    name: string;
    functionId: string;
    published: boolean;
  };
  onMatrixChange: (matrix: {
    name: string;
    functionId: string;
    published: boolean;
  }) => void;
  onSubmit: () => void;
}

export function CreateMatrixDialog({
  isOpen,
  onOpenChange,
  functions,
  newMatrix,
  onMatrixChange,
  onSubmit,
}: CreateMatrixDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createCompMatrix({
        title: newMatrix.name,
        functionId: Number(newMatrix.functionId),
        isPublished: newMatrix.published,
      });

      toast.success("Competency matrix created successfully");
      onOpenChange(false);
      router.refresh();
      onSubmit();
    } catch (error) {
      console.error("Failed to create matrix:", error);
      toast.error("Failed to create competency matrix");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-[1px] border-[var(--primary)]">
        <DialogHeader>
          <DialogTitle>Create New Competency Matrix</DialogTitle>
          <DialogDescription>
            Define the basic properties of your new competency matrix.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Matrix Name</Label>
            <Input
              id="name"
              value={newMatrix.name}
              onChange={(e) =>
                onMatrixChange({ ...newMatrix, name: e.target.value })
              }
              placeholder="e.g., Engineering Competency Matrix"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="function">Function</Label>
            <Select
              value={newMatrix.functionId}
              onValueChange={(value) =>
                onMatrixChange({ ...newMatrix, functionId: value })
              }
            >
              <SelectTrigger id="function">
                <SelectValue placeholder="Select a function" />
              </SelectTrigger>
              <SelectContent>
                {functions.map((func) => (
                  <SelectItem key={func.id} value={func.id.toString()}>
                    {func.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={newMatrix.published}
              onCheckedChange={(checked) =>
                onMatrixChange({ ...newMatrix, published: checked })
              }
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newMatrix.name || !newMatrix.functionId || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Matrix"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
