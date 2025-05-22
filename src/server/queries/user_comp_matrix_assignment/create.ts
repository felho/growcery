import { db } from "~/server/db";
import { userCompMatrixAssignments } from "~/server/db/schema";
import type { NewUserCompMatrixAssignment, UserCompMatrixAssignment } from ".";

export async function createUserCompMatrixAssignment(
  data: NewUserCompMatrixAssignment,
): Promise<UserCompMatrixAssignment> {
  const result = await db
    .insert(userCompMatrixAssignments)
    .values(data)
    .returning();

  if (!result.length) {
    throw new Error("Failed to create user_comp_matrix_assignment");
  }

  return result[0]!;
}
