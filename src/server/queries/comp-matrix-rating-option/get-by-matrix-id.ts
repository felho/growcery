import { db } from "~/server/db";
import { compMatrixRatingOptions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixRatingOption } from "./index";

export async function getRatingOptionsByMatrixId(
  matrixId: number,
): Promise<CompMatrixRatingOption[]> {
  return db
    .select()
    .from(compMatrixRatingOptions)
    .where(eq(compMatrixRatingOptions.competencyMatrixId, matrixId))
    .orderBy(compMatrixRatingOptions.sortOrder);
}
