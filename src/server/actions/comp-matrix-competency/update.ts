"use server";

import { actionClient } from "~/lib/safe-action";
import { updateCompMatrixCompetencySchema } from "~/zod-schemas/comp-matrix-competency";
import { updateCompMatrixCompetency } from "~/server/queries/comp-matrix-competency";

export const updateCompMatrixCompetencyAction = actionClient
  .metadata({ actionName: "updateCompMatrixCompetency" })
  .schema(updateCompMatrixCompetencySchema)
  .action(async ({ parsedInput }) => {
    const competency = await updateCompMatrixCompetency(parsedInput);
    return { competency };
  });
