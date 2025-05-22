"use server";

import { insertFunctionSchemaFromForm } from "~/zod-schemas/function";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { createFunction } from "~/server/queries/function";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export const createFunctionAction = actionClient
  .metadata({ actionName: "createFunctionAction" })
  .schema(insertFunctionSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();

    const id = await createFunction({
      ...parsedInput,
      organizationId,
    });

    return { message: `Function ID #${id} created successfully` };
  });
