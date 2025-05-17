import { db } from "~/server/db";
import { orgUnits } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function deleteOrgUnit(id: number): Promise<number> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .delete(orgUnits)
    .where(eq(orgUnits.id, id))
    .returning({ deletedId: orgUnits.id });
  if (!result.length) throw new Error("Org unit not found");
  return result[0]!.deletedId;
}
