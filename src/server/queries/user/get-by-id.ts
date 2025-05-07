import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import type { UserWithArchetype } from "./index";

export async function getUserById(
  id: number,
): Promise<UserWithArchetype | undefined> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, id),
    with: {
      archetype: true,
    },
  });
}
