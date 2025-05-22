"use server";

import { actionClient } from "~/lib/safe-action";
import { createRatingOptionSchema } from "~/zod-schemas/comp-matrix-rating-option";
import { createCompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option/create";
import { flattenValidationErrors } from "next-safe-action";

export const createRatingOptionAction = actionClient
  .metadata({ actionName: "createRatingOption" })
  .schema(createRatingOptionSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const ratingOption = await createCompMatrixRatingOption(parsedInput);
    return { ratingOption };
  });
