import { db } from "~/server/db";
import {
  compMatrixCurrentRatings,
  userCompMatrixAssignments,
  users,
  compMatrixDefinitions,
} from "~/server/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import type { CompMatrixReferenceRatings } from "./index";

export async function getReferenceRatings(
  matrixId: number,
  competencyId: number,
  userIds?: number[],
): Promise<Record<number, CompMatrixReferenceRatings[]>> {
  // First get all definitions for this competency
  const definitions = await db
    .select({
      id: compMatrixDefinitions.id,
      levelId: compMatrixDefinitions.compMatrixLevelId,
    })
    .from(compMatrixDefinitions)
    .where(eq(compMatrixDefinitions.compMatrixCompetencyId, competencyId));

  const result: Record<number, CompMatrixReferenceRatings[]> = {};

  // For each definition (level), get the reference ratings
  for (const definition of definitions) {
    const whereClauses = [
      eq(compMatrixCurrentRatings.compMatrixId, matrixId),
      eq(compMatrixCurrentRatings.compMatrixDefinitionId, definition.id),
    ];
    if (userIds && userIds.length > 0) {
      whereClauses.push(inArray(users.id, userIds));
    }
    const rows = await db
      .select({
        userId: users.id,
        fullName: users.fullName,
        ratingId: compMatrixCurrentRatings.managerRatingId,
        ratingUpdatedAt: compMatrixCurrentRatings.managerRatingUpdatedAt,
      })
      .from(compMatrixCurrentRatings)
      .innerJoin(
        userCompMatrixAssignments,
        eq(
          compMatrixCurrentRatings.userCompMatrixAssignmentId,
          userCompMatrixAssignments.id,
        ),
      )
      .innerJoin(users, eq(userCompMatrixAssignments.revieweeId, users.id))
      .where(and(...whereClauses))
      .orderBy(compMatrixCurrentRatings.managerRatingUpdatedAt)
      .limit(10);

    // Convert null dates to new Date() to match the type
    result[definition.levelId] = rows.map((row) => ({
      ...row,
      ratingUpdatedAt: row.ratingUpdatedAt ?? new Date(),
    }));
  }

  return result;
}
