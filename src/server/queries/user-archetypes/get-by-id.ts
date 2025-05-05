import { db } from "~/server/db";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";
import { eq } from "drizzle-orm";

export async function getUserArchetypeById(id: number) {
  return db.query.userArchetypes.findFirst({
    where: eq(userArchetypes.id, id),
  });
}
