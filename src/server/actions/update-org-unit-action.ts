"use server";

import { updateOrgUnitSchemaFromForm } from "~/zod-schemas/org-unit";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateOrgUnit } from "~/server/queries";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export const updateOrgUnitAction = actionClient
  .metadata({ actionName: "updateOrgUnitAction" })
  .schema(updateOrgUnitSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();

    const id = await updateOrgUnit({
      ...parsedInput,
      organizationId,
      parentId: parsedInput.parentId ? Number(parsedInput.parentId) : undefined,
    });

    return { message: `Organizational unit ID #${id} updated successfully` };
  });
