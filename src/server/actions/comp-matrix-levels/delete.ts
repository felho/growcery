"use server";

import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { deleteLevel } from "~/server/queries/comp-matrix-level";
import { deleteLevelSchema } from "~/zod-schemas/comp-matrix-level";

export const deleteLevelAction = actionClient
  .metadata({ actionName: "deleteLevelAction" })
  .schema(deleteLevelSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const level = await deleteLevel(parsedInput.matrixId, parsedInput.levelId);
    return { level };
  });
