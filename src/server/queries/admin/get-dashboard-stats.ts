import { db } from "~/server/db";
import { functions, orgUnits, users } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, count } from "drizzle-orm";

export async function getDashboardStats(organizationId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [functionCount, orgUnitCount, userCount] = await Promise.all([
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
  ]);

  return {
    functionCount: functionCount[0]?.count ?? 0,
    orgUnitCount: orgUnitCount[0]?.count ?? 0,
    userCount: userCount[0]?.count ?? 0,
  };
}
