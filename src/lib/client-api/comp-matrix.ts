import type {
  CompMatrix,
  CompMatrixWithFullRelations,
} from "~/server/queries/comp-matrix";
import type {
  CreateCompMatrixPayload,
  UpdateCompMatrixPayload,
} from "~/zod-schemas/comp-matrix";

export async function fetchCompMatrix(
  id: number,
): Promise<CompMatrixWithFullRelations> {
  const res = await fetch(`/api/comp-matrices/${id}`);
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

export async function deleteCompMatrix(id: number): Promise<void> {
  const response = await fetch(`/api/comp-matrices/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete comp matrix");
  }
}

export async function updateCompMatrix(
  matrixId: number,
  data: UpdateCompMatrixPayload,
): Promise<CompMatrix> {
  const response = await fetch(`/api/comp-matrices/${matrixId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update comp matrix");
  }

  return response.json();
}

export async function getAllCompMatricesByOrg(): Promise<CompMatrix[]> {
  const res = await fetch("/api/comp-matrices");
  if (!res.ok) {
    throw new Error("Failed to fetch comp matrices");
  }
  return res.json();
}
