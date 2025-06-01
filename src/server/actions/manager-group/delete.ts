"use server";

import { actionClient } from "~/lib/safe-action";
import { z } from "zod";
import { flattenValidationErrors } from "next-safe-action";
import { db } from "~/server/db";
import { managerGroups, managerGroupMembers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// Define the schema for the delete action
const deleteManagerGroupSchema = z.object({
  id: z.number(),
});

export const deleteManagerGroupAction = actionClient
  .metadata({ actionName: "deleteManagerGroupAction" })
  .schema(deleteManagerGroupSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // First delete all member associations
    await db
      .delete(managerGroupMembers)
      .where(eq(managerGroupMembers.managerGroupId, id));

    // Then delete the manager group itself
    await db
      .delete(managerGroups)
      .where(eq(managerGroups.id, id));

    return { message: `Manager group #${id} deleted successfully` };
  });
