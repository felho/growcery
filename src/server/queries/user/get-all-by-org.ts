import { db } from "~/server/db";
// import { auth } from "@clerk/nextjs/server";
import type { UserWithArchetype } from "./index";

export async function getAllUsersForOrg(
  organizationId: number,
): Promise<UserWithArchetype[]> {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");

  return db.query.users.findMany({
    where: (u, { eq }) => eq(u.organizationId, organizationId),
    with: {
      archetype: true,
    },
  });
}
