"use server";

import { insertManagerGroupSchemaFromForm } from "~/zod-schemas/manager-group";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import { db } from "~/server/db";
import { managerGroups, managerGroupMembers } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export const createManagerGroupAction = actionClient
  .metadata({ actionName: "createManagerGroupAction" })
  .schema(insertManagerGroupSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { name, description, members } = parsedInput;
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the organization ID
    const organizationId = getCurrentUserOrgId();

    // Get the user ID from the auth provider ID
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.authProviderId, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Create the manager group
    const [newManagerGroup] = await db
      .insert(managerGroups)
      .values({
        name,
        description,
        organizationId,
        createdBy: user.id,
      })
      .returning();

    if (!newManagerGroup) {
      throw new Error("Failed to create manager group");
    }

    // Add members to the manager group
    const memberEntries = members.map((memberId: string) => ({
      managerGroupId: newManagerGroup.id,
      userId: parseInt(memberId, 10),
      addedAt: new Date(),
    }));

    await db.insert(managerGroupMembers).values(memberEntries);

    return { message: `Manager group #${newManagerGroup.id} created successfully` };
  });
