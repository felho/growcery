import { db } from "~/server/db";
import { compMatrixCurrentRatings } from "~/server/db/schema";
import { and, inArray } from "drizzle-orm";

export async function getCurrentRatingsByUserIds(userIds: number[]) {
  if (!userIds.length) return [];

  return await db
    .select()
    .from(compMatrixCurrentRatings)
    .where(
      inArray(compMatrixCurrentRatings.userCompMatrixAssignmentId, userIds),
    );
}
