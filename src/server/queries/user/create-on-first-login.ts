import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { InsertUserInputWithAuth } from "~/zod-schemas/user";

export async function createUserOnFirstLogin(
  data: InsertUserInputWithAuth,
): Promise<number> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existingUserByEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1)
    .then((rows) => rows[0] || null);

  if (existingUserByEmail) {
    const needsUpdate =
      existingUserByEmail.authProviderId !== data.authProviderId ||
      ((existingUserByEmail.fullName === "" ||
        existingUserByEmail.fullName !== data.fullName) &&
        data.fullName !== "");

    if (needsUpdate) {
      const updateData: { authProviderId?: string; fullName?: string } = {};

      if (existingUserByEmail.authProviderId !== data.authProviderId) {
        updateData.authProviderId = data.authProviderId;
      }

      if (
        (existingUserByEmail.fullName === "" ||
          existingUserByEmail.fullName !== data.fullName) &&
        data.fullName !== ""
      ) {
        updateData.fullName = data.fullName;
      }

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, existingUserByEmail.id));

      console.log(
        `User data updated for ID ${existingUserByEmail.id}:`,
        updateData,
      );
    }

    return existingUserByEmail.id;
  }

  const result = await db
    .insert(users)
    .values(data)
    .returning({ insertedId: users.id });
  if (!result.length) throw new Error("Failed to create user");
  return result[0]!.insertedId;
}
