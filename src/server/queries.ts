import "server-only";
import { db } from "./db";
import { functions, orgUnits, users } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { count } from "drizzle-orm";
import type {
  InsertUserInputWithAuth,
  UpdateUserInput,
  InsertUserInput,
} from "~/zod-schemas/user";
import type { InferSelectModel } from "drizzle-orm";
import type { UpdateFunctionInput } from "~/zod-schemas/function";
import type { InsertFunctionInput } from "~/zod-schemas/function";
import type { UpdateOrgUnitInput } from "~/zod-schemas/org-unit";
import type { InsertOrgUnitInput } from "~/zod-schemas/org-unit";

export type UserRecord = InferSelectModel<typeof users>;

export async function getUserById(id: number): Promise<UserRecord | undefined> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, id),
  });
}

export async function getUserByAuthProviderId(
  authProviderId: string,
): Promise<UserRecord | undefined> {
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

export async function createUser(data: InsertUserInput) {
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

export async function getFunctionsByOrg(
  organizationId: number,
): Promise<FunctionRecord[] | undefined> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  return db.query.functions.findMany({
    where: (f, { eq }) => eq(f.organizationId, organizationId),
  });
}

export type OrgUnitRecord = InferSelectModel<typeof orgUnits>;

export async function getOrgUnitById(
  id: number,
): Promise<OrgUnitRecord | undefined> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.orgUnits.findFirst({
    where: (ou, { eq }) => eq(ou.id, id),
  });
}

export async function getAllOrgUnitsForOrg(
  organizationId: number,
): Promise<OrgUnitRecord[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.orgUnits.findMany({
    where: (ou, { eq }) => eq(ou.organizationId, organizationId),
  });
}

export async function createOrgUnit(data: InsertOrgUnitInput): Promise<number> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .insert(orgUnits)
    .values(data)
    .returning({ insertedId: orgUnits.id });

  if (!result.length) throw new Error("Failed to create org unit");

  return result[0]!.insertedId;
}

export async function updateOrgUnit(data: UpdateOrgUnitInput): Promise<number> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { id, ...updates } = data;

  const result = await db
    .update(orgUnits)
    .set(updates)
    .where(eq(orgUnits.id, id))
    .returning({ updatedId: orgUnits.id });

  if (!result.length) throw new Error("Org unit not found");

  return result[0]!.updatedId;
}

export async function getAllUsersForOrg(
  organizationId: number,
): Promise<UserRecord[]> {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  return db.query.users.findMany({
    where: (u, { eq }) => eq(u.organizationId, organizationId),
  });
}

export async function getDashboardStats(organizationId: number) {
  const [functionCount, orgUnitCount, userCount] = await Promise.all([
    db
      .select({ count: count() })
      .from(functions)
      .where(eq(functions.organizationId, organizationId)),
    db
      .select({ count: count() })
      .from(orgUnits)
      .where(eq(orgUnits.organizationId, organizationId)),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.organizationId, organizationId)),
  ]);

  return {
    functionCount: functionCount[0]?.count ?? 0,
    orgUnitCount: orgUnitCount[0]?.count ?? 0,
    userCount: userCount[0]?.count ?? 0,
  };
}
