import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import type { User } from "./index";

export async function getAllUsersForOrg(
  organizationId: number,
): Promise<User[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.users.findMany({
    where: (u, { eq }) => eq(u.organizationId, organizationId),
  });
}
