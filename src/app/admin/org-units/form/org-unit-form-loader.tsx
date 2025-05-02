import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import OrgUnitFormPage from "./org-unit-form-page";
import { getAllOrgUnitsForOrg, getOrgUnitById } from "~/server/queries";
import type { InsertOrgUnitInputFromForm } from "~/zod-schemas/org-unit";
import { notFound } from "next/navigation";

interface LoaderProps {
  searchParams: {
    orgUnitId?: string;
    parentName?: string;
  };
}

export default async function OrgUnitFormLoader({ searchParams }: LoaderProps) {
  const organizationId = await getCurrentUserOrgId();
  const allOrgUnits = await getAllOrgUnitsForOrg(organizationId);

  const parentOptions = allOrgUnits.map((unit) => ({
    id: unit.id,
    name: unit.name,
    parentId: unit.parentId ?? null,
  }));

  let orgUnit: (InsertOrgUnitInputFromForm & { id: number }) | undefined;

  const { orgUnitId } = await searchParams;

  if (orgUnitId) {
    const unit = await getOrgUnitById(Number(orgUnitId));
    if (!unit) notFound();

    orgUnit = {
      id: unit.id,
      name: unit.name,
      description: unit.description ?? "",
      parentId: unit.parentId ?? undefined,
    };
  }

  return (
    <OrgUnitFormPage
      organizationId={organizationId}
      parentOptions={parentOptions}
      orgUnit={orgUnit}
    />
  );
}
