"use server";

import { updateFunctionSchemaFromForm } from "~/zod-schemas/function";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateFunction } from "~/server/queries";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export const updateFunctionAction = actionClient
  .metadata({ actionName: "updateFunctionAction" })
  .schema(updateFunctionSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();

    const id = await updateFunction({
      ...parsedInput,
      organizationId,
    });

    return { message: `Function ID #${id} updated successfully` };
  });
