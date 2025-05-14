import { db } from "~/server/db";
import { compMatrixDefinitions } from "~/server/db/schema";
import type { UpsertCompMatrixDefinition } from "~/server/queries/comp-matrix-definition";
import { and, eq } from "drizzle-orm";

export async function upsertCompMatrixDefinition(
  input: UpsertCompMatrixDefinition,
) {
  const existing = await db.query.compMatrixDefinitions.findFirst({
    where: and(
      eq(
        compMatrixDefinitions.compMatrixCompetencyId,
        input.compMatrixCompetencyId,
      ),
      eq(compMatrixDefinitions.compMatrixLevelId, input.compMatrixLevelId),
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(compMatrixDefinitions)
      .set({
        definition: input.definition,
        inheritsPreviousLevel: input.inheritsPreviousLevel,
        assessmentHint: input.assessmentHint,
      })
      .where(eq(compMatrixDefinitions.id, existing.id))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(compMatrixDefinitions)
      .values(input)
      .returning();
    return created;
  }
}
