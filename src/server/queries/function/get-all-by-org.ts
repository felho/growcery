import { db } from "~/server/db";
// import { auth } from "@clerk/nextjs/server";
import type { Function } from "./index";

export async function getFunctionsByOrg(
  organizationId: number,
): Promise<Function[]> {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");

  return db.query.functions.findMany({
    where: (f, { eq }) => eq(f.organizationId, organizationId),
  });
}
