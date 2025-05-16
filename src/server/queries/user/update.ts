import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import type { UpdateUserInput } from "~/zod-schemas/user";

export async function updateUser(data: UpdateUserInput): Promise<number> {
  const { id, ...updates } = data;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Only process fields that are explicitly set to 0 as null values
  const processedUpdates = { ...updates };

  if (updates.functionId === 0) processedUpdates.functionId = null;
  if (updates.managerId === 0) processedUpdates.managerId = null;
  if (updates.orgUnitId === 0) processedUpdates.orgUnitId = null;
  if (updates.archetypeId === 0) processedUpdates.archetypeId = null;

  const result = await db
    .update(users)
    .set(processedUpdates)
    .where(eq(users.id, id))
    .returning({ updatedId: users.id });

  if (!result.length) throw new Error(`User ID #${id} not found`);
  return result[0]!.updatedId;
}
