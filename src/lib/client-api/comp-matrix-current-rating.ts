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
