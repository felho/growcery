import "server-only";
import { db } from "./db";
import { users } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export async function getUserByAuthProviderId(authProviderId: string) {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.authProviderId, authProviderId),
  });

  return user;
}

export async function createUser(userDetails: {
  authProviderId: string;
  fullName: string;
  email: string;
}) {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const user = await db.insert(users).values(userDetails);

  return user;
}
