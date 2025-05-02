"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";
import { useAction } from "next-safe-action/hooks";
import { createOrgUnitAction } from "~/server/actions/create-org-unit-action";
import { updateOrgUnitAction } from "~/server/actions/update-org-unit-action";
import { OrgUnitForm } from "./org-unit-form";
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
  const parentIdFromQuery = searchParams.get("parentId");

  const mode: "create" | "edit" = orgUnit ? "edit" : "create";

  const form = useForm<InsertOrgUnitInputFromForm>({
    resolver: zodResolver(insertOrgUnitSchemaFromForm),
    defaultValues: {
      name: orgUnit?.name ?? "",
      description: orgUnit?.description ?? "",
      parentId:
        mode === "edit"
          ? (orgUnit?.parentId ?? undefined)
          : parentIdFromQuery
            ? Number(parentIdFromQuery)
            : undefined,
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
    if (mode === "edit" && orgUnit?.id) {
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
          {mode === "edit"
            ? "Edit Organizational Unit"
            : parentName
              ? `Add Sub-unit to ${parentName}`
              : "Create Root Unit"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Modify the details of the organizational unit"
            : parentName
              ? "Add a new organizational unit under the selected parent unit"
              : "Add a new root organizational unit"}
        </p>
        <p className="text-muted-foreground text-sm">
          (Org ID: <code>{organizationId}</code>)
        </p>
      </div>

      <OrgUnitForm
        form={form}
        onSubmit={onSubmit}
        parentOptions={parentOptions}
        isPending={isPending}
        mode={mode}
      />
    </div>
  );
}
