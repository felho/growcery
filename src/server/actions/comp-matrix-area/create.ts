"use server";

import { actionClient } from "~/lib/safe-action";
import { createCompMatrixAreaSchema } from "~/zod-schemas/comp-matrix-area";
import { createCompMatrixArea } from "~/server/queries/comp-matrix-area/create";

export const createCompMatrixAreaAction = actionClient
  .metadata({ actionName: "createCompMatrixArea" })
  .schema(createCompMatrixAreaSchema)
  .action(async ({ parsedInput }) => {
    const area = await createCompMatrixArea(parsedInput);
    return { area };
  });
