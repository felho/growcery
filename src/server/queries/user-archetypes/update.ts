import { db } from "~/server/db";
import { userArchetypes } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { UpdateUserArchetypeInput } from "~/zod-schemas/user-archetype";

export async function updateUserArchetype(
  data: UpdateUserArchetypeInput,
): Promise<number> {
  const { id, ...updates } = data;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .update(userArchetypes)
    .set(updates)
    .where(eq(userArchetypes.id, id))
    .returning({ updatedId: userArchetypes.id });
  if (!result.length) throw new Error(`User archetype ID #${id} not found`);
  return result[0]!.updatedId;
}
