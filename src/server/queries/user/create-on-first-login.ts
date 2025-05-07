import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import type { InsertUserInputWithAuth } from "~/zod-schemas/user";

export async function createUserOnFirstLogin(
  data: InsertUserInputWithAuth,
): Promise<number> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .insert(users)
    .values(data)
    .returning({ insertedId: users.id });
  if (!result.length) throw new Error("Failed to create user");
  return result[0]!.insertedId;
}
