"use server";

import { actionClient } from "~/lib/safe-action";
import { reorderCompMatrixAreasSchema } from "~/zod-schemas/comp-matrix-area";
import { reorderCompMatrixAreas } from "~/server/queries/comp-matrix-area";

export const reorderCompMatrixAreasAction = actionClient
  .metadata({ actionName: "reorderCompMatrixAreas" })
  .schema(reorderCompMatrixAreasSchema)
  .action(async ({ parsedInput }) => {
    const { matrixId, areas } = parsedInput;
    const result = await reorderCompMatrixAreas(matrixId, areas);
    return { success: true, data: result };
  });
