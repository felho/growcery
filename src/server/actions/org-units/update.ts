"use server";

import { updateOrgUnitSchema } from "~/zod-schemas/org-unit";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateOrgUnit } from "~/server/queries";

export const updateOrgUnitAction = actionClient
  .metadata({ actionName: "updateOrgUnitAction" })
  .schema(updateOrgUnitSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const id = await updateOrgUnit({
      ...parsedInput,
      parentId: parsedInput.parentId ? Number(parsedInput.parentId) : undefined,
    });

    return {
      message: `Organizational unit ID #${id} updated successfully`,
      id,
    };
  });
