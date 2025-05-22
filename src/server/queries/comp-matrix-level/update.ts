import { db } from "~/server/db";
import { compMatrixLevels } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixLevel, UpdateLevelInput } from "./index";

export async function updateLevel(
  input: UpdateLevelInput,
): Promise<CompMatrixLevel> {
  const { levelId, title, description, persona, areaOfImpact } = input;

  const [updated] = await db
    .update(compMatrixLevels)
    .set({
      jobTitle: title,
      roleSummary: description,
      persona,
      areaOfImpact,
    })
    .where(eq(compMatrixLevels.id, levelId))
    .returning();

  if (!updated) {
    throw new Error(`Level with id ${levelId} not found`);
  }

  return updated;
}
