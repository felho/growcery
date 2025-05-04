import { db } from "~/server/db";
import { functions } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { UpdateFunctionInput } from "~/zod-schemas/function";

export async function updateFunction(
  data: UpdateFunctionInput,
): Promise<number> {
  const { id, ...updates } = data;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .update(functions)
    .set(updates)
    .where(eq(functions.id, id))
    .returning({ updatedId: functions.id });
  if (!result.length) throw new Error(`Function ID #${id} not found`);
  return result[0]!.updatedId;
}
