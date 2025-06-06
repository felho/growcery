import type { CompMatrixForAssignment } from "~/server/queries/comp-matrix/get-published";

export async function fetchPublishedCompMatrices(): Promise<CompMatrixForAssignment[]> {
  const response = await fetch(`/api/comp-matrices/published`);
  if (!response.ok) {
    throw new Error("Failed to fetch published matrices");
  }
  return response.json();
}
