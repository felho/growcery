"use server";

import { actionClient } from "~/lib/safe-action";
import { z } from "zod";
import { deleteCompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option/delete";

const deleteSchema = z.object({
  id: z.number(),
});

export const deleteRatingOptionAction = actionClient
  .metadata({ actionName: "deleteRatingOption" })
  .schema(deleteSchema)
  .action(async ({ parsedInput }) => {
    const deleted = await deleteCompMatrixRatingOption(parsedInput.id);
    return { deleted };
  });
