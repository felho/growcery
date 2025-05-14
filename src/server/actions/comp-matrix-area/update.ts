"use server";

import { actionClient } from "~/lib/safe-action";
import { updateCompMatrixAreaSchema } from "~/zod-schemas/comp-matrix-area";
import { updateCompMatrixArea } from "~/server/queries/comp-matrix-area/update";

export const updateCompMatrixAreaAction = actionClient
  .metadata({ actionName: "updateCompMatrixArea" })
  .schema(updateCompMatrixAreaSchema)
  .action(async ({ parsedInput }) => {
    const area = await updateCompMatrixArea(parsedInput);
    return { area };
  });
