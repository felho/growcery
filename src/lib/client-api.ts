export async function fetchFunctions() {
  const res = await fetch("/api/functions");
  if (!res.ok) throw new Error("Failed to fetch functions");
  return res.json();
}

import type { OrgUnitRecord } from "~/server/queries";

export async function fetchOrgUnits(): Promise<OrgUnitRecord[]> {
  const res = await fetch("/api/org-units");
  if (!res.ok) throw new Error("Failed to fetch org units");
  return res.json();
}
