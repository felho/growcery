"use server";

import { insertUserSchemaFromForm } from "~/zod-schemas/user";
import { flattenValidationErrors } from "next-safe-action";
import { actionClient } from "~/lib/safe-action";
import { createUser } from "~/server/queries";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export const createUserAction = actionClient
  .metadata({ actionName: "createUserAction" })
  .schema(insertUserSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();

    const insertedId = await createUser({
      ...parsedInput,
      organizationId,
    });
    return { message: `User ID #${insertedId} created successfully` };
  });
