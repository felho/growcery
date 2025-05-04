import type { Function } from "~/server/queries/functions";

export async function fetchFunctions(): Promise<Function[]> {
  const res = await fetch("/api/functions");
  if (!res.ok) throw new Error("Failed to fetch functions");
  return res.json();
}

import type { OrgUnit } from "~/server/queries/org-units";

export async function fetchOrgUnits(): Promise<OrgUnit[]> {
  const res = await fetch("/api/org-units");
  if (!res.ok) throw new Error("Failed to fetch org units");
  return res.json();
}

import type { User } from "~/server/queries/users";

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
