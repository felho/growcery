"use server";

import { actionClient } from "~/lib/safe-action";
import { deleteCompMatrixAreaSchema } from "~/zod-schemas/comp-matrix-area";
import { deleteCompMatrixArea } from "~/server/queries/comp-matrix-area/delete";

export const deleteCompMatrixAreaAction = actionClient
  .metadata({ actionName: "deleteCompMatrixArea" })
  .schema(deleteCompMatrixAreaSchema)
  .action(async ({ parsedInput }) => {
    await deleteCompMatrixArea(parsedInput.id);
    return { success: true };
  });
