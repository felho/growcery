"use server";

import { actionClient } from "~/lib/safe-action";
import { reorderCompMatrixCompetencies } from "~/server/queries/comp-matrix-competency/reorder";
import { reorderCompMatrixCompetenciesSchema } from "~/zod-schemas/comp-matrix-competency";

export const reorderCompMatrixCompetenciesAction = actionClient
  .metadata({ actionName: "reorderCompMatrixCompetencies" })
  .schema(reorderCompMatrixCompetenciesSchema)
  .action(async ({ parsedInput }) => {
    const { areaId } = parsedInput;
    const reordered = await reorderCompMatrixCompetencies(parsedInput);
    return {
      areaId,
      competencies: reordered,
    };
  });
