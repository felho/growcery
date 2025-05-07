import { db } from "~/server/db";
import { orgUnits } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import type { InsertOrgUnitInput } from "~/zod-schemas/org-unit";

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
