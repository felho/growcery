import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";

export async function fetchCompMatrix(
  id: number,
): Promise<CompMatrixWithFullRelations> {
  const res = await fetch(`/api/comp-matrix/${id}`);
  if (!res.ok) throw new Error("Failed to fetch comp matrix");
  return res.json();
}
