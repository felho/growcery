import { db } from "~/server/db";
import { orgUnits } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { UpdateOrgUnitInput } from "~/zod-schemas/org-unit";

export async function updateOrgUnit(data: UpdateOrgUnitInput): Promise<number> {
  const { id, ...updates } = data;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .update(orgUnits)
    .set(updates)
    .where(eq(orgUnits.id, id))
    .returning({ updatedId: orgUnits.id });
  if (!result.length) throw new Error("Org unit not found");
  return result[0]!.updatedId;
}
