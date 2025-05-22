import { db } from "~/server/db";
import { userCompMatrixAssignments } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { UserCompMatrixAssignment } from ".";

export async function getActiveUserCompMatrixAssignmentByUserId(
  userId: number,
): Promise<UserCompMatrixAssignment | null> {
  const [result] = await db
    .select()
    .from(userCompMatrixAssignments)
    .where(
      and(
        eq(userCompMatrixAssignments.revieweeId, userId),
        eq(userCompMatrixAssignments.isActive, true),
      ),
    );

  return result ?? null;
}
