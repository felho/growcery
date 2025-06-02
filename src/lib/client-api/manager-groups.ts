import type { ManagerGroupWithMembers } from "~/server/queries/manager-group";

export async function fetchManagerGroups(): Promise<ManagerGroupWithMembers[]> {
  const res = await fetch("/api/manager-groups");
  if (!res.ok) throw new Error("Failed to fetch manager groups");
  return res.json();
}

export async function fetchManagerGroupById(id: number): Promise<ManagerGroupWithMembers> {
  const res = await fetch(`/api/manager-groups/${id}`);
  if (!res.ok) throw new Error("Failed to fetch manager group");
  return res.json();
}
