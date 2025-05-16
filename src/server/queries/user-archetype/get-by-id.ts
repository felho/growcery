import { db } from "~/server/db";
// import { auth } from "@clerk/nextjs/server";
import type { UserArchetype } from "./index";

export async function getUserArchetypeById(
  id: number,
): Promise<UserArchetype | undefined> {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");

  return db.query.userArchetypes.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });
}
