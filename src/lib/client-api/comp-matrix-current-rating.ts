import type { CompMatrixRatingsForUIMap } from "~/server/queries/comp-matrix-current-rating";

export async function fetchCompMatrixCurrentRating(
  url: string,
): Promise<CompMatrixRatingsForUIMap> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch comp matrix current rating");
  return res.json();
}
