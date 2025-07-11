import type { UserWithArchetypeAndAssignments } from "~/server/queries/user";
import type { UserWithActiveMatrixName } from "~/server/queries/user/get-all-with-active-matrix-name";

export async function fetchUsers(): Promise<UserWithArchetypeAndAssignments[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchUsersWithActiveMatrixAssignments(): Promise<
  UserWithArchetypeAndAssignments[]
> {
  const response = await fetch("/api/users/with-active-matrix-assignments");
  if (!response.ok) {
    throw new Error("Failed to fetch users with active matrix assignments");
  }
  return response.json();
}

export async function fetchUsersWithMatrixNames(): Promise<UserWithActiveMatrixName[]> {
  const response = await fetch("/api/users/with-matrix-names");
  if (!response.ok) {
    throw new Error("Failed to fetch users with matrix names");
  }
  return response.json();
}
