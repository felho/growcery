import { syncUserToDb } from "~/server/actions/sync-user";

export async function SyncUser() {
  await syncUserToDb();
  return null;
}
