"use client";

import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/app/_components/form/input-with-label";
import { TextareaWithLabel } from "~/app/_components/form/textarea-with-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createFunctionAction } from "~/server/actions/create-function-action";
import { updateFunctionAction } from "~/server/actions/update-function-action";
import { toast } from "sonner";
import { LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  insertFunctionSchemaFromForm,
  type InsertFunctionInputFromForm,
} from "~/zod-schemas/function";

interface FunctionFormProps {
  mode: "create" | "edit";
  func?: InsertFunctionInputFromForm & { id: number };
}

export function FunctionForm({ mode, func }: FunctionFormProps) {
  const router = useRouter();

  const form = useForm<InsertFunctionInputFromForm>({
    resolver: zodResolver(insertFunctionSchemaFromForm),
    defaultValues: {
      name: func?.name ?? "",
      description: func?.description ?? "",
    },
    mode: "onBlur",
  });

  const { execute: createFunction, isPending: isCreating } = useAction(
    createFunctionAction,
    {
      onSuccess({ data }) {
        toast.success(data?.message || "Function created.");
        router.push("/admin/functions");
      },
      onError() {
        toast.error("Something went wrong while creating the function.");
      },
    },
  );

  const { execute: updateFunction, isPending: isUpdating } = useAction(
    updateFunctionAction,
    {
      onSuccess({ data }) {
        toast.success(data?.message || "Function updated.");
        router.push("/admin/functions");
      },
      onError() {
        toast.error("Something went wrong while updating the function.");
      },
    },
  );

  async function onSubmit(values: InsertFunctionInputFromForm) {
    if (mode === "edit" && func?.id) {
      updateFunction({ id: func.id, ...values });
    } else {
      createFunction({ ...values });
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputWithLabel<InsertFunctionInputFromForm>
            fieldTitle="Function Name"
            nameInSchema="name"
            placeholder="Enter function name"
            autoFocus
          />

          <TextareaWithLabel<InsertFunctionInputFromForm>
            fieldTitle="Description"
            nameInSchema="description"
            placeholder="Enter function description"
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-40 cursor-pointer"
            >
              {isPending ? (
                <>
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : mode === "edit" ? (
                "Update Function"
              ) : (
                "Save Function"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/functions")}
              className="w-40 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
