import { db } from "~/server/db";
import { userCompMatrixAssignments } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { UserCompMatrixAssignment } from ".";

export async function getUserCompMatrixAssignmentByUserId(
  userId: number,
): Promise<UserCompMatrixAssignment | null> {
  const [result] = await db
    .select()
    .from(userCompMatrixAssignments)
    .where(eq(userCompMatrixAssignments.revieweeId, userId));

  return result ?? null;
}
