import "server-only";
import { db } from "./db";
import { functions, users } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type {
  InsertUserInputFromForm,
  InsertUserInputWithAuth,
  UpdateUserInput,
} from "~/zod-schemas/user";
import type { InferSelectModel } from "drizzle-orm";
import type { UpdateFunctionInput } from "~/zod-schemas/function";
import type { InsertFunctionInput } from "~/zod-schemas/function";

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

export type FunctionRecord = InferSelectModel<typeof functions>;

export async function getFunctionById(
  id: number,
): Promise<FunctionRecord | undefined> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  return db.query.functions.findFirst({
    where: (f, { eq }) => eq(f.id, id),
  });
}

export async function createFunction(
  data: InsertFunctionInput,
): Promise<number> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const result = await db
    .insert(functions)
    .values(data)
    .returning({ insertedId: functions.id });

  if (!result.length) {
    throw new Error("Failed to create function");
  }

  return result[0]!.insertedId;
}

export async function updateFunction(
  data: UpdateFunctionInput,
): Promise<number> {
  const { id, ...updates } = data;

  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const result = await db
    .update(functions)
    .set(updates)
    .where(eq(functions.id, id))
    .returning({ updatedId: functions.id });

  if (!result.length) {
    throw new Error(`Function ID #${id} not found`);
  }

  return result[0]!.updatedId;
}
