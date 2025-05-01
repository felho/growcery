import { insertOrgUnitSchemaFromForm } from "~/zod-schemas/org-unit";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import { createOrgUnit } from "~/server/queries";

export const createOrgUnitAction = actionClient
  .metadata({ actionName: "createOrgUnitAction" })
  .schema(insertOrgUnitSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();

    const parentId = parsedInput.parentId ?? undefined;

    const id = await createOrgUnit({
      ...parsedInput,
      organizationId,
      parentId,
    });

    return { message: `Organizational unit ID #${id} created successfully` };
  });
