import { db } from "~/server/db";
import { functions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { Function } from "./index";

export async function deleteFunction(id: number): Promise<Function> {
  const [deletedFunction] = await db
    .delete(functions)
    .where(eq(functions.id, id))
    .returning();

  if (!deletedFunction) {
    throw new Error(`Function with ID ${id} not found`);
  }

  return deletedFunction;
}
