"use server";

import { insertUserSchemaFromForm } from "~/zod-schemas/user";
import { flattenValidationErrors } from "next-safe-action";
import { actionClient } from "~/lib/safe-action";
import { createUser } from "~/server/queries";

export const createUserAction = actionClient
  .metadata({ actionName: "createUserAction" })
  .schema(insertUserSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const insertedId = await createUser(parsedInput);
    return { message: `User ID #${insertedId} created successfully` };
  });
