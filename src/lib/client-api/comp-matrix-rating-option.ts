import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";

export async function fetchCompMatrixRatingOptions(
  matrixId: number,
): Promise<CompMatrixRatingOption[]> {
  const res = await fetch(`/api/comp-matrix-rating-options/${matrixId}`);
  if (!res.ok) throw new Error("Failed to fetch comp matrix rating options");
  return res.json();
}
