"use server";

import { db } from "~/server/db";
import { userCompMatrixAssignments } from "~/server/db/schema/tables/user_comp_matrix_assignments";
import { users } from "~/server/db/schema/tables/users";
import { z } from "zod";
import { actionClient } from "~/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const schema = z.object({
  revieweeId: z.number(),
  compMatrixId: z.number(),
});

export const assignMatrixToUserAction = actionClient
  .metadata({ actionName: "assignMatrixToUser" })
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const loggedInUser = await db.query.users.findFirst({
      where: eq(users.authProviderId, clerkUserId),
    });

    if (!loggedInUser) {
      throw new Error("User not found");
    }
    const { revieweeId, compMatrixId } = parsedInput;

    await db
      .update(userCompMatrixAssignments)
      .set({ isActive: false })
      .where(
        and(
          eq(userCompMatrixAssignments.revieweeId, revieweeId),
          eq(userCompMatrixAssignments.isActive, true),
        ),
      );

    await db.insert(userCompMatrixAssignments).values({
      revieweeId,
      compMatrixId,
      createdBy: loggedInUser.id,
      isActive: true,
    });

    return { success: true };
  });
