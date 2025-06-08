import { db } from "~/server/db";
import { compMatrixCurrentRatings } from "~/server/db/schema";
import { and, inArray } from "drizzle-orm";

export async function getCurrentRatingsByAssignmentIds(assignmentIds: number[]) {
  if (!assignmentIds.length) return [];

  return await db
    .select()
    .from(compMatrixCurrentRatings)
    .where(
      inArray(compMatrixCurrentRatings.userCompMatrixAssignmentId, assignmentIds),
    );
}
