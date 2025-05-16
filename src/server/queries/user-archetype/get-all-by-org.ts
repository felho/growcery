import { db } from "~/server/db";
// import { auth } from "@clerk/nextjs/server";
import type { UserArchetype } from "./index";

export async function getAllUserArchetypesForOrg(
  organizationId: number,
): Promise<UserArchetype[]> {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");

  return db.query.userArchetypes.findMany({
    where: (a, { eq }) => eq(a.organizationId, organizationId),
  });
}
