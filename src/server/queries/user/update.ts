import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import type { UpdateUserInput } from "~/zod-schemas/user";

export async function updateUser(data: UpdateUserInput): Promise<number> {
  const { id, ...updates } = data;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning({ updatedId: users.id });
  if (!result.length) throw new Error(`User ID #${id} not found`);
  return result[0]!.updatedId;
}
