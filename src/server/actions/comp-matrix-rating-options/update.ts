"use server";

import { actionClient } from "~/lib/safe-action";
import { updateRatingOptionSchema } from "~/zod-schemas/comp-matrix-rating-options";
import { updateCompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option/update";
import { flattenValidationErrors } from "next-safe-action";
export const updateRatingOptionAction = actionClient
  .metadata({ actionName: "updateRatingOption" })
  .schema(updateRatingOptionSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const ratingOption = await updateCompMatrixRatingOption(parsedInput);
    return { ratingOption };
  });
