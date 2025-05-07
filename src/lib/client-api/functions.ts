import type { Function } from "~/server/queries/function";

export async function fetchFunctions(): Promise<Function[]> {
  const res = await fetch("/api/functions");
  if (!res.ok) throw new Error("Failed to fetch functions");
  return res.json();
}
