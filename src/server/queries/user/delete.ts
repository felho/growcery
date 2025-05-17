import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "./index";

export async function deleteUser(id: number): Promise<User> {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deletedUser) {
    throw new Error(`User with ID ${id} not found`);
  }

  return deletedUser;
}
