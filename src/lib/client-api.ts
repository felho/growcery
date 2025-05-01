export async function fetchFunctions() {
  const res = await fetch("/api/functions");
  if (!res.ok) throw new Error("Failed to fetch functions");
  return res.json();
}
