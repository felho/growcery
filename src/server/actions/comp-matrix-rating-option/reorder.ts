"use server";

import { actionClient } from "~/lib/safe-action";
import { reorderRatingOptionsSchema } from "~/zod-schemas/comp-matrix-rating-option";
import { reorderCompMatrixRatingOptions } from "~/server/queries/comp-matrix-rating-option/reorder";

export const reorderRatingOptionsAction = actionClient
  .metadata({ actionName: "reorderRatingOptions" })
  .schema(reorderRatingOptionsSchema)
  .action(async ({ parsedInput }) => {
    const result = await reorderCompMatrixRatingOptions(parsedInput);
    return result;
  });
