import type { UserArchetype } from "~/server/queries/user-archetype";

export async function fetchUserArchetypes(): Promise<UserArchetype[]> {
  const res = await fetch("/api/user-archetypes");
  if (!res.ok) throw new Error("Failed to fetch user archetypes");
  return res.json();
}
