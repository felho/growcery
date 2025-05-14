import { db } from "~/server/db";
import { compMatrixRatingOptions } from "~/server/db/schema";
import type {
  NewCompMatrixRatingOption,
  CompMatrixRatingOption,
} from "./index";
import { eq } from "drizzle-orm";

export async function createCompMatrixRatingOption(
  input: NewCompMatrixRatingOption,
): Promise<CompMatrixRatingOption> {
  const { competencyMatrixId, ...rest } = input;

  const maxRow = await db
    .select({ max: compMatrixRatingOptions.sortOrder })
    .from(compMatrixRatingOptions)
    .where(eq(compMatrixRatingOptions.competencyMatrixId, competencyMatrixId))
    .orderBy(compMatrixRatingOptions.sortOrder)
    .limit(1);

  const maxSortOrder = maxRow?.[0]?.max ?? 0;

  const [created] = await db
    .insert(compMatrixRatingOptions)
    .values({
      ...rest,
      competencyMatrixId,
      sortOrder: maxSortOrder + 1,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create rating option");
  }

  return created;
}
