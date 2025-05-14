"use server";

import { actionClient } from "~/lib/safe-action";
import { createRatingOptionSchema } from "~/zod-schemas/comp-matrix-rating-options";
import { createCompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option/create";

export const createRatingOptionAction = actionClient
  .metadata({ actionName: "createRatingOption" })
  .schema(createRatingOptionSchema)
  .action(async ({ parsedInput }) => {
    const ratingOption = await createCompMatrixRatingOption(parsedInput);
    return { ratingOption };
  });
