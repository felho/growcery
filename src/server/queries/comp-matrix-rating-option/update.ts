import { db } from "~/server/db";
import { compMatrixRatingOptions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixRatingOption } from "./index";

export async function updateCompMatrixRatingOption(
  updates: CompMatrixRatingOption,
): Promise<CompMatrixRatingOption> {
  const { id, ...rest } = updates;
  const [updated] = await db
    .update(compMatrixRatingOptions)
    .set(rest)
    .where(eq(compMatrixRatingOptions.id, id))
    .returning();

  if (!updated) {
    throw new Error(`Rating option with id ${id} not found`);
  }

  return updated;
}
