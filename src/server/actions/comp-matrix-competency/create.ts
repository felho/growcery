"use server";

import { actionClient } from "~/lib/safe-action";
import { createCompMatrixCompetencySchema } from "~/zod-schemas/comp-matrix-competency";
import { createCompMatrixCompetency } from "~/server/queries/comp-matrix-competency/create";

export const createCompMatrixCompetencyAction = actionClient
  .metadata({ actionName: "createCompMatrixCompetency" })
  .schema(createCompMatrixCompetencySchema)
  .action(async ({ parsedInput }) => {
    const competency = await createCompMatrixCompetency(parsedInput);
    return { competency };
  });
