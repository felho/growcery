import { db } from "~/server/db";
import { compMatrixLevelAssessments } from "~/server/db/schema/tables/comp-matrix-level-assessments";
import { eq } from "drizzle-orm";

export async function getLevelAssessments(userCompMatrixAssignmentId: number) {
  return db.query.compMatrixLevelAssessments.findMany({
    where: eq(
      compMatrixLevelAssessments.userCompMatrixAssignmentId,
      userCompMatrixAssignmentId,
    ),
  });
}
