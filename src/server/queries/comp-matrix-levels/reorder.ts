import { db } from "~/server/db";
import { compMatrixLevels } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { Level, ReorderLevelsInput, ReorderLevelsOutput } from "./index";

export async function reorderLevels(
  input: ReorderLevelsInput,
): Promise<ReorderLevelsOutput> {
  const { matrixId, levels } = input;

  // Update each level's numericLevel in a transaction
  await db.transaction(async (tx) => {
    for (const level of levels) {
      await tx
        .update(compMatrixLevels)
        .set({ numericLevel: level.numericLevel })
        .where(eq(compMatrixLevels.id, level.id));
    }
  });

  // Return the updated levels
  return db
    .select()
    .from(compMatrixLevels)
    .where(eq(compMatrixLevels.compMatrixId, matrixId))
    .orderBy(compMatrixLevels.numericLevel);
}
