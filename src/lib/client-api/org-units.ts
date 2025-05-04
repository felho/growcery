import type { OrgUnit } from "~/server/queries/org-units";

export async function fetchOrgUnits(): Promise<OrgUnit[]> {
  const res = await fetch("/api/org-units");
  if (!res.ok) throw new Error("Failed to fetch org units");
  return res.json();
}
