import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import OrgUnitFormPage from "./org-unit-form-page";

export default async function OrgUnitFormLoader() {
  const organizationId = await getCurrentUserOrgId();
  return <OrgUnitFormPage organizationId={organizationId} />;
}
