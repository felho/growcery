"use server";

import { z } from "zod";
import { actionClient } from "~/lib/safe-action";
import { deleteUserArchetype } from "~/server/queries/user-archetype/delete";

const deleteUserArchetypeSchema = z.object({
  id: z.number().int(),
});

export const deleteUserArchetypeAction = actionClient
  .metadata({ actionName: "deleteUserArchetypeAction" })
  .schema(deleteUserArchetypeSchema)
  .action(async ({ parsedInput }) => {
    const id = await deleteUserArchetype(parsedInput.id);
    return { message: `Archetype ID #${id} deleted successfully` };
  });
