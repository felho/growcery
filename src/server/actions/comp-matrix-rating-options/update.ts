"use server";

import { actionClient } from "~/lib/safe-action";
import { updateRatingOptionSchema } from "~/zod-schemas/comp-matrix-rating-options";
import { updateCompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option/update";

export const updateRatingOptionAction = actionClient
  .metadata({ actionName: "updateRatingOption" })
  .schema(updateRatingOptionSchema)
  .action(async ({ parsedInput }) => {
    const ratingOption = await updateCompMatrixRatingOption(parsedInput);
    return { ratingOption };
  });
