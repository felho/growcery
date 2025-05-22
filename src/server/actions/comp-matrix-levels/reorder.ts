"use server";

import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { reorderLevels } from "~/server/queries/comp-matrix-levels/reorder";
import { reorderLevelsSchema } from "~/zod-schemas/comp-matrix-level";

export const reorderLevelsAction = actionClient
  .metadata({ actionName: "reorderLevelsAction" })
  .schema(reorderLevelsSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const levels = await reorderLevels(parsedInput);
    return { levels: levels };
  });
