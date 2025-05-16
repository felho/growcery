import { db } from "~/server/db";
import { userArchetypes } from "~/server/db/schema";
// import { auth } from "@clerk/nextjs/server";
import type { InsertUserArchetypeInput } from "~/zod-schemas/user-archetype";

export async function createUserArchetype(
  data: InsertUserArchetypeInput,
): Promise<number> {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");

  const result = await db
    .insert(userArchetypes)
    .values(data)
    .returning({ insertedId: userArchetypes.id });
  if (!result.length) throw new Error("Failed to create user archetype");
  return result[0]!.insertedId;
}
