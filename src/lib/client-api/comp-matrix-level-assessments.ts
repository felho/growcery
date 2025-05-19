import type { LevelAssessment } from "~/zod-schemas/comp-matrix-level-assessments";

export async function fetchCompMatrixLevelAssessments(
  userCompMatrixAssignmentId: number,
): Promise<LevelAssessment[]> {
  const response = await fetch(
    `/api/comp-matrix-level-assessments?userCompMatrixAssignmentId=${userCompMatrixAssignmentId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch level assessments");
  }

  return response.json();
}
