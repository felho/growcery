import { db } from "~/server/db";
import { functions } from "~/server/db/schema";
// import { auth } from "@clerk/nextjs/server";
import type { InsertFunctionInput } from "~/zod-schemas/function";

export async function createFunction(
  data: InsertFunctionInput,
): Promise<number> {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");

  const result = await db
    .insert(functions)
    .values(data)
    .returning({ insertedId: functions.id });
  if (!result.length) throw new Error("Failed to create function");
  return result[0]!.insertedId;
}
