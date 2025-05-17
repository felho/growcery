import type { CompMatrixReferenceRatings } from "~/server/queries/comp-matrix-current-rating";

export async function fetchCompMatrixReferenceRatings(
  matrixId: number,
  competencyId: number,
): Promise<Record<number, CompMatrixReferenceRatings[]>> {
  try {
    const res = await fetch(
      `/api/comp-matrix-reference-ratings?matrixId=${matrixId}&competencyId=${competencyId}`,
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
