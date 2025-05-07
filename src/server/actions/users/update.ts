"use server";

import { updateUserSchema } from "~/zod-schemas/user";
import { flattenValidationErrors } from "next-safe-action";
import { actionClient } from "~/lib/safe-action";
import { updateUser } from "~/server/queries/user";

export const updateUserAction = actionClient
  .metadata({ actionName: "updateUserAction" })
  .schema(updateUserSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const updatedId = await updateUser(parsedInput);
    return { message: `User ID #${updatedId} updated successfully` };
  });
