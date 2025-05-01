import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import OrgUnitFormPage from "./org-unit-form-page";
import { getAllOrgUnitsForOrg } from "~/server/queries";

export default async function OrgUnitFormLoader() {
  const organizationId = await getCurrentUserOrgId();
  const allOrgUnits = await getAllOrgUnitsForOrg(organizationId);

  const parentOptions = allOrgUnits.map((unit) => ({
    id: unit.id,
    name: unit.name,
  }));

  return (
    <OrgUnitFormPage
      organizationId={organizationId}
      parentOptions={parentOptions}
    />
  );
}
