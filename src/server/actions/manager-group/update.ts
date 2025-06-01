"use server";

import { updateManagerGroupSchema } from "~/zod-schemas/manager-group";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { db } from "~/server/db";
import { managerGroups, managerGroupMembers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const updateManagerGroupAction = actionClient
  .metadata({ actionName: "updateManagerGroupAction" })
  .schema(updateManagerGroupSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { id, name, description, members } = parsedInput;
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Update the manager group
    await db
      .update(managerGroups)
      .set({
        name,
        description,
        updatedAt: new Date(),
      })
      .where(eq(managerGroups.id, id));

    // Delete existing members
    await db
      .delete(managerGroupMembers)
      .where(eq(managerGroupMembers.managerGroupId, id));

    // Add new members
    const memberEntries = members.map((memberId: string) => ({
      managerGroupId: id,
      userId: parseInt(memberId, 10),
      addedAt: new Date(),
    }));

    await db.insert(managerGroupMembers).values(memberEntries);

    return { message: `Manager group #${id} updated successfully` };
  });
