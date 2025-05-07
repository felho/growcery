import type { UserWithArchetype } from "~/server/queries/user";

export async function fetchUsers(): Promise<UserWithArchetype[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
