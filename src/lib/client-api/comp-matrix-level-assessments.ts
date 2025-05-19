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

export async function fetchCompMatrixLevelAssessmentsByAssignmentIds(
  userCompMatrixAssignmentIds: number[],
): Promise<Record<number, LevelAssessment[]>> {
  const response = await fetch(
    "/api/comp-matrix-level-assessments/by-assignment-ids",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userCompMatrixAssignmentIds: userCompMatrixAssignmentIds,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch level assessments by assignmentIds");
  }

  return response.json();
}
