import type { CompMatrixReferenceRatings } from "~/server/queries/comp-matrix-current-rating";

export async function fetchCompMatrixReferenceRatings(
  matrixId: number,
  competencyId: number,
  userIds: number[],
): Promise<Record<number, CompMatrixReferenceRatings[]>> {
  try {
    const params = new URLSearchParams({
      matrixId: String(matrixId),
      competencyId: String(competencyId),
    });
    if (userIds && userIds.length > 0) {
      params.append("userIds", userIds.join(","));
    }
    const res = await fetch(
      `/api/comp-matrix-reference-ratings?${params.toString()}`,
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch comp matrix reference ratings: ${errorText}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching reference ratings:", error);
    return {}; // Return empty object on error to prevent UI from breaking
  }
}
