import { db } from "~/server/db";
import { compMatrixLevels } from "~/server/db/schema";
import { eq, gte, and, sql } from "drizzle-orm";
import type { CreateLevelInput } from "~/zod-schemas/comp-matrix-levels";

export async function createLevel(input: CreateLevelInput) {
  const {
    matrixId,
    title,
    description,
    persona,
    areaOfImpact,
    insertPosition,
  } = input;

  // If insertPosition is provided, we need to shift existing levels
  if (insertPosition !== undefined) {
    // Update numericLevel for all levels that come after the insert position
    await db
      .update(compMatrixLevels)
      .set({
        numericLevel: sql`${compMatrixLevels.numericLevel} + 1`,
      })
      .where(
        and(
          eq(compMatrixLevels.compMatrixId, matrixId),
          gte(compMatrixLevels.numericLevel, insertPosition),
        ),
      );
  }

  // Get the next numericLevel value
  const maxLevel = await db
    .select({ max: compMatrixLevels.numericLevel })
    .from(compMatrixLevels)
    .where(eq(compMatrixLevels.compMatrixId, matrixId))
    .orderBy(compMatrixLevels.numericLevel)
    .limit(1);

  const nextNumericLevel = insertPosition ?? (maxLevel[0]?.max ?? 0) + 1;

  // Create the new level
  const [newLevel] = await db
    .insert(compMatrixLevels)
    .values({
      compMatrixId: matrixId,
      numericLevel: nextNumericLevel,
      jobTitle: title,
      roleSummary: description,
      persona,
      areaOfImpact,
      levelCode: `L${nextNumericLevel}`, // Generate a simple level code
    })
    .returning();

  return newLevel;
}
