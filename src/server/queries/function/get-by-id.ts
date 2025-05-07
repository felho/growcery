import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import type { Function } from "./index";

export async function getFunctionById(
  id: number,
): Promise<Function | undefined> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.functions.findFirst({
    where: (f, { eq }) => eq(f.id, id),
  });
}
