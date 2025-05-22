"use server";

import { db } from "~/server/db";
import { compMatrixLevelAssessments } from "~/server/db/schema/tables/comp-matrix-level-assessments";
import { and, eq } from "drizzle-orm";
import { compMatrixLevelAssessmentSchema } from "~/zod-schemas/comp-matrix-level-assessment";

export async function updateLevelAssessmentAction(data: {
  userCompMatrixAssignmentId: number;
  compMatrixId: number;
  isGeneral: boolean;
  compMatrixAreaId?: number;
  mainLevel: number;
  subLevel: number;
}) {
  const validatedData = compMatrixLevelAssessmentSchema.parse(data);

  const existing = await db.query.compMatrixLevelAssessments.findFirst({
    where: and(
      eq(
        compMatrixLevelAssessments.userCompMatrixAssignmentId,
        validatedData.userCompMatrixAssignmentId,
      ),
      eq(compMatrixLevelAssessments.isGeneral, validatedData.isGeneral),
      validatedData.isGeneral
        ? undefined
        : eq(
            compMatrixLevelAssessments.compMatrixAreaId,
            validatedData.compMatrixAreaId!,
          ),
    ),
  });

  if (!existing) {
    throw new Error("Level assessment not found");
  }

  return db
    .update(compMatrixLevelAssessments)
    .set({
      mainLevel: validatedData.mainLevel,
      subLevel: validatedData.subLevel,
      updatedAt: new Date(),
    })
    .where(eq(compMatrixLevelAssessments.id, existing.id))
    .returning();
}
