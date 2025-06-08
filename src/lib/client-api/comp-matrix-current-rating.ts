import type { CompMatrixRatingsForUIMap } from "~/server/queries/comp-matrix-current-rating";

export async function fetchCompMatrixCurrentRating(
  assignmentId: number,
): Promise<CompMatrixRatingsForUIMap> {
  const res = await fetch(
    `/api/comp-matrix-current-ratings?assignmentId=${assignmentId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch comp matrix current rating");
  return res.json();
}

export async function fetchCompMatrixCurrentRatingsByAssignmentIds(assignmentIds: number[]) {
  if (!assignmentIds.length) return [];
  const res = await fetch("/api/comp-matrix-current-ratings/by-assignment-ids", {
    method: "POST",
    body: JSON.stringify({ assignmentIds }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch current ratings");
  return res.json();
}
