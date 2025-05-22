"use server";

import { actionClient } from "~/lib/safe-action";
import { deleteFunctionSchema } from "~/zod-schemas/function";
import { deleteFunction } from "~/server/queries/function/delete";

export const deleteFunctionAction = actionClient
  .metadata({ actionName: "deleteFunction" })
  .schema(deleteFunctionSchema)
  .action(async ({ parsedInput }) => {
    const deleted = await deleteFunction(parsedInput.id);
    return { deleted };
  });
