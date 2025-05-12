"use server";

import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { createLevel } from "~/server/queries/comp-matrix-levels/create";
import { createLevelSchema } from "~/zod-schemas/comp-matrix-levels";

export const createLevelAction = actionClient
  .metadata({ actionName: "createLevelAction" })
  .schema(createLevelSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const level = await createLevel(parsedInput);
    return { level };
  });
