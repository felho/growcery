import { db } from "~/server/db";
import { orgUnits } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { OrgUnit } from "./index";

export async function getAllOrgUnitsForOrg(
  organizationId: number,
): Promise<OrgUnit[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.orgUnits.findMany({
    where: (ou, { eq }) => eq(ou.organizationId, organizationId),
  });
}
