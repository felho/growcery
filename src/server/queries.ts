import "server-only";
import { db } from "./db";
import { users } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type {
  InsertUserInputFromForm,
  InsertUserInputWithAuth,
  UpdateUserInput,
} from "~/zod-schemas/user";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export async function getUserById(id: number): Promise<User | undefined> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, id),
  });
}

export async function getUserByAuthProviderId(
  authProviderId: string,
): Promise<User | undefined> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.authProviderId, authProviderId),
  });
}

export async function createUserOnFirstLogin(data: InsertUserInputWithAuth) {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const result = await db
    .insert(users)
    .values(data)
    .returning({ insertedId: users.id });

  if (!result.length) {
    throw new Error("Failed to create user");
  }

  return result[0]!.insertedId;
}

export async function createUser(data: InsertUserInputFromForm) {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const result = await db
    .insert(users)
    .values(data)
    .returning({ insertedId: users.id });

  if (!result.length) {
    throw new Error("Failed to create user");
  }

  return result[0]!.insertedId;
}

export async function updateUser(data: UpdateUserInput) {
  const { id, ...updates } = data;

  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const result = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning({ updatedId: users.id });

  if (!result.length) {
    throw new Error(`User ID #${id} not found`);
  }

  return result[0]!.updatedId;
}
