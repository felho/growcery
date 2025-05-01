"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { SelectWithLabel } from "~/app/_components/form/select-with-label";
import { toast } from "sonner";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";
import { useAction } from "next-safe-action/hooks";
import { createOrgUnitAction } from "~/server/actions/create-org-unit-action";
import { updateOrgUnitAction } from "~/server/actions/update-org-unit-action";
import { LoaderCircle as LoaderIcon } from "lucide-react";
import {
  insertOrgUnitSchemaFromForm,
  type InsertOrgUnitInputFromForm,
} from "~/zod-schemas/org-unit";

interface OrgUnitFormPageProps {
  organizationId: number;
  parentOptions: { id: number; name: string }[];
  orgUnit?: InsertOrgUnitInputFromForm & { id: number };
}

export default function OrgUnitFormPage({
  organizationId,
  parentOptions,
  orgUnit,
}: OrgUnitFormPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentName = searchParams.get("parentName");

  const isEditMode = !!orgUnit;

  const form = useForm<InsertOrgUnitInputFromForm>({
    resolver: zodResolver(insertOrgUnitSchemaFromForm),
    defaultValues: {
      name: orgUnit?.name ?? "",
      description: orgUnit?.description ?? "",
      parentId: orgUnit?.parentId ?? undefined,
    },
  });

  const { execute: createOrgUnit, isPending: isCreating } = useAction(
    createOrgUnitAction,
    {
      onSuccess({ data }) {
        toast.success(data?.message);
        router.push("/admin/org-units");
      },
      onError() {
        toast.error("Failed to create organizational unit.");
      },
    },
  );

  const { execute: updateOrgUnit, isPending: isUpdating } = useAction(
    updateOrgUnitAction,
    {
      onSuccess({ data }) {
        toast.success(data?.message);
        router.push("/admin/org-units");
      },
      onError() {
        toast.error("Failed to update organizational unit.");
      },
    },
  );

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: InsertOrgUnitInputFromForm) => {
    if (isEditMode && orgUnit?.id) {
      updateOrgUnit({ id: orgUnit.id, ...values });
    } else {
      createOrgUnit({ organizationId, ...values });
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isEditMode
            ? "Edit Organizational Unit"
            : parentName
              ? `Add Sub-unit to ${parentName}`
              : "Create Root Unit"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Modify the details of the organizational unit"
            : parentName
              ? "Add a new organizational unit under the selected parent unit"
              : "Add a new root organizational unit"}
        </p>
        <p className="text-muted-foreground text-sm">
          (Org ID: <code>{organizationId}</code>)
        </p>
      </div>

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter unit name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SelectWithLabel<
              InsertOrgUnitInputFromForm,
              { id: number; description: string }
            >
              fieldTitle="Parent Unit (optional)"
              nameInSchema="parentId"
              placeholder="None"
              data={parentOptions.map((u) => ({
                id: u.id,
                description: u.name,
              }))}
              getValue={(item) => item.id.toString()}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter unit description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                    {isEditMode ? "Updating..." : "Saving..."}
                  </>
                ) : isEditMode ? (
                  "Update Unit"
                ) : (
                  "Create Unit"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin/org-units")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
