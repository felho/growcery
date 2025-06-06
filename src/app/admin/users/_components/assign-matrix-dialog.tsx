"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAction } from "next-safe-action/hooks";
import { assignMatrixToUserAction } from "~/server/actions/user-comp-matrix-assignment/create";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Grid3X3, User } from "lucide-react";
import type { CompMatrixForAssignment } from "~/server/queries/comp-matrix/get-published";

const formSchema = z.object({
  matrixId: z.string().min(1, "Please select a matrix"),
});

interface AssignMatrixDialogProps {
  userId: number;
  userName: string;
  functionId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  matrices: CompMatrixForAssignment[];
  isLoading?: boolean;
}

export function AssignMatrixDialog({
  userId,
  userName,
  functionId,
  open,
  onOpenChange,
  onSuccess,
  matrices,
  isLoading = false,
}: AssignMatrixDialogProps) {
  const filteredMatrices = functionId
    ? matrices.filter((matrix) => matrix.functionId === functionId)
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matrixId: "",
    },
  });

  const { execute: assignMatrix, status } = useAction(
    assignMatrixToUserAction,
    {
      onSuccess: () => {
        toast.success("Matrix assigned successfully");
        onSuccess();
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.error?.serverError || "Failed to assign matrix");
      },
    },
  );

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    assignMatrix({
      revieweeId: userId,
      compMatrixId: parseInt(values.matrixId, 10),
    });
  };

  const isSubmitting = status === "executing";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Add Competency Matrix
          </DialogTitle>
          <DialogDescription>
            Assign a competency matrix to{" "}
            <span className="inline-flex items-center gap-1 font-medium">
              <User className="h-3 w-3" />
              {userName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="matrixId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrix</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select matrix" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredMatrices.map((matrix) => (
                        <SelectItem
                          key={matrix.id}
                          value={matrix.id.toString()}
                        >
                          {matrix.title}
                        </SelectItem>
                      ))}
                      {filteredMatrices.length === 0 && (
                        <SelectItem value="none" disabled>
                          No matrices available for this function
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? "Adding..." : "Add Matrix"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
