import { db } from "~/server/db";
import { userArchetypes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function deleteUserArchetype(id: number): Promise<number> {
  const result = await db
    .delete(userArchetypes)
    .where(eq(userArchetypes.id, id))
    .returning({ deletedId: userArchetypes.id });
  if (!result.length) throw new Error(`User archetype ID #${id} not found`);
  return result[0]!.deletedId;
}
