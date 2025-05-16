import type { UserWithArchetype } from "~/server/queries/user";

export async function fetchUsers(): Promise<UserWithArchetype[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchUsersWithActiveMatrixAssignments(): Promise<
  UserWithArchetype[]
> {
  const response = await fetch("/api/users/with-active-matrix-assignments");
  if (!response.ok) {
    throw new Error("Failed to fetch users with active matrix assignments");
  }
  return response.json();
}
