import type { UserCompMatrixAssignment } from "~/server/queries/user_comp_matrix_assignment";

export async function fetchActiveUserCompMatrixAssignment(
  userId: number,
): Promise<UserCompMatrixAssignment | null> {
  const res = await fetch(`/api/user-comp-matrix-assignments/active/${userId}`);
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch user comp matrix assignment");
  }
  return res.json();
}
