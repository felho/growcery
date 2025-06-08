import { db } from "~/server/db";
import { functions, orgUnits, users, userArchetypes, compMatrices } from "~/server/db/schema";
import { managerGroups } from "~/server/db/schema/tables/manager-groups";
import { auth } from "@clerk/nextjs/server";
import { eq, count } from "drizzle-orm";

export async function getDashboardStats(organizationId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [functionCount, orgUnitCount, userCount, archetypeCount, managerGroupCount, compMatrixCount] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(functions)
        .where(eq(functions.organizationId, organizationId)),
      db
        .select({ count: count() })
        .from(orgUnits)
        .where(eq(orgUnits.organizationId, organizationId)),
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.organizationId, organizationId)),
      db
        .select({ count: count() })
        .from(userArchetypes)
        .where(eq(userArchetypes.organizationId, organizationId)),
      db
        .select({ count: count() })
        .from(managerGroups)
        .where(eq(managerGroups.organizationId, organizationId)),
      db
        .select({ count: count() })
        .from(compMatrices)
        .where(eq(compMatrices.organizationId, organizationId)),
    ]);

  return {
    functionCount: functionCount[0]?.count ?? 0,
    orgUnitCount: orgUnitCount[0]?.count ?? 0,
    userCount: userCount[0]?.count ?? 0,
    archetypeCount: archetypeCount[0]?.count ?? 0,
    managerGroupCount: managerGroupCount[0]?.count ?? 0,
    compMatrixCount: compMatrixCount[0]?.count ?? 0,
  };


}
