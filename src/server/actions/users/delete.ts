"use server";

import { actionClient } from "~/lib/safe-action";
import { deleteUserSchema } from "~/zod-schemas/user";
import { deleteUser } from "~/server/queries/user/delete";

export const deleteUserAction = actionClient
  .metadata({ actionName: "deleteUser" })
  .schema(deleteUserSchema)
  .action(async ({ parsedInput }) => {
    const deleted = await deleteUser(parsedInput.id);
    return { deleted };
  });
