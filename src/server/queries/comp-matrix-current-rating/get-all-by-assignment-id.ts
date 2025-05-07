import { db } from "~/server/db";
import { compMatrixCurrentRatings } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixRatingsForUIMap } from "~/server/queries/comp-matrix-current-rating";

export async function getCurrentRatingsByAssignment(
  assignmentId: number,
): Promise<CompMatrixRatingsForUIMap> {
  const rows = await db
    .select()
    .from(compMatrixCurrentRatings)
    .where(
      eq(compMatrixCurrentRatings.userCompMatrixAssignmentId, assignmentId),
    );

  const ratingMap: CompMatrixRatingsForUIMap = {};

  for (const row of rows) {
    ratingMap[row.compMatrixDefinitionId] = {
      selfRatingId: row.selfRatingId ?? undefined,
      selfComment: row.selfComment,
      selfRatingUpdatedAt: row.selfRatingUpdatedAt ?? new Date(),
      managerId: row.managerId,
      managerRatingId: row.managerRatingId ?? undefined,
      managerComment: row.managerComment,
      managerRatingUpdatedAt: row.managerRatingUpdatedAt ?? new Date(),
    };
  }

  return ratingMap;
}
