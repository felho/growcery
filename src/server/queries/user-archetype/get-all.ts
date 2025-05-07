import { db } from "~/server/db";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";
import { eq } from "drizzle-orm";

export async function getAllUserArchetypesForOrg(organizationId: number) {
  return db.query.userArchetypes.findMany({
    where: eq(userArchetypes.organizationId, organizationId),
  });
}
