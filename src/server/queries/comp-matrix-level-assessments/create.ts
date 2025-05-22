import { db } from "~/server/db";
import { compMatrixLevelAssessments } from "~/server/db/schema/tables/comp-matrix-level-assessments";
import { and, eq } from "drizzle-orm";
import type { LevelAssessment } from "~/zod-schemas/comp-matrix-level-assessment";

export async function createLevelAssessment(data: LevelAssessment) {
  // Check if assessment already exists
  const existing = await db.query.compMatrixLevelAssessments.findFirst({
    where: and(
      eq(
        compMatrixLevelAssessments.userCompMatrixAssignmentId,
        data.userCompMatrixAssignmentId,
      ),
      eq(compMatrixLevelAssessments.isGeneral, data.isGeneral),
      data.isGeneral
        ? undefined
        : eq(
            compMatrixLevelAssessments.compMatrixAreaId,
            data.compMatrixAreaId!,
          ),
    ),
  });

  if (existing) {
    // Update existing assessment
    return db
      .update(compMatrixLevelAssessments)
      .set({
        mainLevel: data.mainLevel,
        subLevel: data.subLevel,
        updatedAt: new Date(),
      })
      .where(eq(compMatrixLevelAssessments.id, existing.id))
      .returning();
  }

  // Create new assessment
  return db.insert(compMatrixLevelAssessments).values(data).returning();
}
