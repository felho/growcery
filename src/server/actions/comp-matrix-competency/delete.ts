"use server";

import { actionClient } from "~/lib/safe-action";
import { deleteCompMatrixCompetencySchema } from "~/zod-schemas/comp-matrix-competency";
import { deleteCompMatrixCompetency } from "~/server/queries/comp-matrix-competency/delete";

export const deleteCompMatrixCompetencyAction = actionClient
  .metadata({ actionName: "deleteCompMatrixCompetency" })
  .schema(deleteCompMatrixCompetencySchema)
  .action(async ({ parsedInput }) => {
    const deleted = await deleteCompMatrixCompetency(parsedInput.id);
    return { deleted };
  });
