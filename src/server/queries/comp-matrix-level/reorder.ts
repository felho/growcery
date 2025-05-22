import { db } from "~/server/db";
import { compMatrixLevels } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixLevel, ReorderCompMatrixLevelsInput } from "./index";

export async function reorderLevels(
  input: ReorderCompMatrixLevelsInput,
): Promise<CompMatrixLevel[]> {
  const { matrixId, levels } = input;

  for (const level of levels) {
    await db
      .update(compMatrixLevels)
      .set({ numericLevel: level.numericLevel })
      .where(eq(compMatrixLevels.id, level.id));
  }

  return db
    .select()
    .from(compMatrixLevels)
    .where(eq(compMatrixLevels.compMatrixId, matrixId))
    .orderBy(compMatrixLevels.numericLevel);
}
