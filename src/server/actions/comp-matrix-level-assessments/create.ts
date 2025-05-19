"use server";

import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { createLevelAssessment } from "~/server/queries/comp-matrix-level-assessments/create";
import { createLevelAssessmentSchema } from "~/zod-schemas/comp-matrix-level-assessments";

export const createLevelAssessmentAction = actionClient
  .metadata({ actionName: "createLevelAssessmentAction" })
  .schema(createLevelAssessmentSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const assessment = await createLevelAssessment({
      ...parsedInput,
    });

    return { assessment };
  });
