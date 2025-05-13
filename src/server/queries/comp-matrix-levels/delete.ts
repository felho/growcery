import { db } from "~/server/db";
import { compMatrixLevels } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { CompMatrixLevel } from "./index";

export async function deleteLevel(
  matrixId: number,
  levelId: number,
): Promise<CompMatrixLevel> {
  // Ellenőrizzük, hogy a level létezik és a megadott matrix-hoz tartozik
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

  // Töröljük a levelet
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

  return deletedLevel;
}
