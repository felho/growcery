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

  let nextNumericLevel: number;

  if (insertPosition !== undefined) {
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

    nextNumericLevel = insertPosition;
  } else {
    const [{ max } = { max: 0 }] = await db
      .select({ max: sql<number>`max(${compMatrixLevels.numericLevel})` })
      .from(compMatrixLevels)
      .where(eq(compMatrixLevels.compMatrixId, matrixId));

    nextNumericLevel = max + 1;
  }

  const [newLevel] = await db
    .insert(compMatrixLevels)
    .values({
      compMatrixId: matrixId,
      numericLevel: nextNumericLevel,
      jobTitle: title,
      roleSummary: description,
      persona,
      areaOfImpact,
      levelCode: `L${nextNumericLevel}`,
    })
    .returning();

  return newLevel;
}
