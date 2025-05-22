"use server";

import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateLevel } from "~/server/queries/comp-matrix-level/update";
import { updateLevelSchema } from "~/zod-schemas/comp-matrix-level";

export const updateLevelAction = actionClient
  .metadata({ actionName: "updateLevelAction" })
  .schema(updateLevelSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const level = await updateLevel(parsedInput);
    return { level };
  });
