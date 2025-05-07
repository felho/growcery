import { db } from "~/server/db";
import { orgUnits } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { OrgUnit } from "./index";

export async function getOrgUnitById(id: number): Promise<OrgUnit | undefined> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.orgUnits.findFirst({
    where: (ou, { eq }) => eq(ou.id, id),
  });
}
