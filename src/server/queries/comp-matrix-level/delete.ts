import { db } from "~/server/db";
import { compMatrixLevels } from "~/server/db/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import type { CompMatrixLevel } from "./index";

export async function deleteLevel(
  matrixId: number,
  levelId: number,
): Promise<CompMatrixLevel> {
  const [level] = await db
    .select()
    .from(compMatrixLevels)
    .where(
      and(
        eq(compMatrixLevels.id, levelId),
        eq(compMatrixLevels.compMatrixId, matrixId),
      ),
    );

  if (!level) {
    throw new Error(`Level with id ${levelId} not found in matrix ${matrixId}`);
  }

  const [deletedLevel] = await db
    .delete(compMatrixLevels)
    .where(
      and(
        eq(compMatrixLevels.id, levelId),
        eq(compMatrixLevels.compMatrixId, matrixId),
      ),
    )
    .returning();

  if (!deletedLevel) {
    throw new Error(`Failed to delete level ${levelId}`);
  }

  await db
    .update(compMatrixLevels)
    .set({
      numericLevel: sql`${compMatrixLevels.numericLevel} - 1`,
    })
    .where(
      and(
        eq(compMatrixLevels.compMatrixId, matrixId),
        gt(compMatrixLevels.numericLevel, level.numericLevel),
      ),
    );

  return deletedLevel;
}
