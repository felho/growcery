import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import type { User } from "./index";

export async function getUserByAuthProviderId(
  authProviderId: string,
): Promise<User | undefined> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.authProviderId, authProviderId),
  });
}
