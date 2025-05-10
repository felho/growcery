import type {
  CompMatrix,
  CompMatrixWithFullRelations,
} from "~/server/queries/comp-matrix";
import type { CreateCompMatrixPayload } from "~/zod-schemas/comp-matrix/comp-matrix";

export async function fetchCompMatrix(
  id: number,
): Promise<CompMatrixWithFullRelations> {
  const res = await fetch(`/api/comp-matrix/${id}`);
  if (!res.ok) throw new Error("Failed to fetch comp matrix");
  return res.json();
}

export async function fetchCompMatrices(): Promise<CompMatrix[]> {
  const response = await fetch("/api/comp-matrices");
  if (!response.ok) {
    throw new Error("Failed to fetch comp matrices");
  }
  return response.json();
}

export async function createCompMatrix(
  data: CreateCompMatrixPayload,
): Promise<CompMatrix> {
  const response = await fetch("/api/comp-matrices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create comp matrix");
  }

  return response.json();
}
