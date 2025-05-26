"use client";

import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { LoaderCircle as LoaderIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { InsertOrgUnitInputFromForm } from "~/zod-schemas/org-unit";
import { SelectWithLabel } from "~/app/_components/form/select-with-label";
import { InputWithLabel } from "~/app/_components/form/input-with-label";
import { TextareaWithLabel } from "~/app/_components/form/textarea-with-label";

interface OrgUnitFormProps {
  form: UseFormReturn<InsertOrgUnitInputFromForm>;
  onSubmit: (values: InsertOrgUnitInputFromForm) => void;
  parentOptions: { id: number; name: string; parentId?: number | null }[];
  isPending: boolean;
  mode: "create" | "edit";
}

function buildHierarchicalOptions(
  units: { id: number; name: string; parentId?: number | null }[],
  parentId: number | null = null,
  level = 0,
): { id: number; name: string; description: string }[] {
  return units
    .filter((u) => u.parentId === parentId)
    .flatMap((u) => [
      {
        id: u.id,
        name: u.name,
        description: `${level == 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
      },
      ...buildHierarchicalOptions(units, u.id, level + 1),
    ]);
}

export function OrgUnitForm({
  form,
  onSubmit,
  parentOptions,
  isPending,
  mode,
}: OrgUnitFormProps) {
  const hierarchicalOptions = buildHierarchicalOptions(parentOptions);

  return (
    <div className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputWithLabel<InsertOrgUnitInputFromForm>
            fieldTitle="Unit Name"
            nameInSchema="name"
            placeholder="Enter unit name"
            autoFocus
          />

          <SelectWithLabel<
            InsertOrgUnitInputFromForm,
            { id: number; name: string; description: string }
          >
            fieldTitle="Parent Unit (optional)"
            nameInSchema="parentId"
            placeholder="None"
            data={hierarchicalOptions}
            getValue={(item) => item.id.toString()}
          />

          <TextareaWithLabel<InsertOrgUnitInputFromForm>
            fieldTitle="Description"
            nameInSchema="description"
            placeholder="Enter unit description"
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : mode === "edit" ? (
                "Update Unit"
              ) : (
                "Create Unit"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
