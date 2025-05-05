"use client";

import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/app/_components/form/input-with-label";
import { TextareaWithLabel } from "~/app/_components/form/textarea-with-label";
import {
  insertUserArchetypeSchemaFromForm,
  updateUserArchetypeSchemaFromForm,
  type InsertUserArchetypeInputFromForm,
  type UpdateUserArchetypeInputFromForm,
} from "~/zod-schemas/user-archetype";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createUserArchetypeAction } from "~/server/actions/user-archetypes/create";
import { updateUserArchetypeAction } from "~/server/actions/user-archetypes/update";
import { toast } from "sonner";
import { LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserArchetypeFormProps {
  mode: "create" | "edit";
  archetype?: InsertUserArchetypeInputFromForm & { id: number };
}

export function UserArchetypeForm({ mode, archetype }: UserArchetypeFormProps) {
  const router = useRouter();

  const form = useForm<
    InsertUserArchetypeInputFromForm | UpdateUserArchetypeInputFromForm
  >({
    resolver: zodResolver(
      mode === "edit"
        ? updateUserArchetypeSchemaFromForm
        : insertUserArchetypeSchemaFromForm,
    ),
    defaultValues: {
      name: archetype?.name ?? "",
      description: archetype?.description ?? "",
      ...(mode === "edit" && archetype?.id ? { id: archetype.id } : {}),
    },
    mode: "onBlur",
  });

  const { execute: createArchetype, isPending: isCreating } = useAction(
    createUserArchetypeAction,
    {
      onSuccess({ data }) {
        toast.success(data?.message || "Archetype created.");
        router.push("/admin/user-archetypes");
      },
      onError() {
        toast.error("Something went wrong while creating the archetype.");
      },
    },
  );

  const { execute: updateArchetype, isPending: isUpdating } = useAction(
    updateUserArchetypeAction,
    {
      onSuccess({ data }) {
        toast.success(data?.message || "Archetype updated.");
        router.push("/admin/user-archetypes");
      },
      onError() {
        toast.error("Something went wrong while updating the archetype.");
      },
    },
  );

  async function onSubmit(
    values: InsertUserArchetypeInputFromForm | UpdateUserArchetypeInputFromForm,
  ) {
    if (mode === "edit" && "id" in values && values.id) {
      updateArchetype(values as UpdateUserArchetypeInputFromForm);
    } else {
      createArchetype(values as InsertUserArchetypeInputFromForm);
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputWithLabel<InsertUserArchetypeInputFromForm>
            fieldTitle="Name"
            nameInSchema="name"
            placeholder="Enter archetype name"
            autoFocus
          />

          <TextareaWithLabel<InsertUserArchetypeInputFromForm>
            fieldTitle="Description"
            nameInSchema="description"
            placeholder="Enter archetype description"
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
                "Update Archetype"
              ) : (
                "Save Archetype"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/user-archetypes")}
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
