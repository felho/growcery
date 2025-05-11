import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { compMatrixCurrentRatings } from "~/server/db/schema";
import type { CompMatrixCellSavePayloadAPI } from "~/zod-schemas/comp-matrix-current-rating";
import { getUserByAuthProviderId } from "../user";

export async function saveCompMatrixCellRating(
  input: CompMatrixCellSavePayloadAPI,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { assignmentId, definitionId, ratingId, comment, raterType } = input;

  const [assignment] = await db.query.userCompMatrixAssignments.findMany({
    where: (a, { eq }) => eq(a.id, assignmentId),
    with: { compMatrix: true },
  });

  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  let updateFields: any;
  if (raterType === "manager") {
    const manager = await getUserByAuthProviderId(userId);
    if (!manager) throw new Error("Manager not found");

    updateFields = {
      managerId: manager.id,
      managerRatingId: ratingId,
      managerComment: comment,
    };
  } else {
    updateFields = {
      selfRatingId: ratingId,
      selfComment: comment,
    };
  }

  console.log("updateFields", updateFields);

  return await db
    .insert(compMatrixCurrentRatings)
    .values({
      compMatrixId: assignment.compMatrixId,
      userCompMatrixAssignmentId: assignmentId,
      compMatrixDefinitionId: definitionId,
      ...updateFields,
    })
    .onConflictDoUpdate({
      target: [
        compMatrixCurrentRatings.userCompMatrixAssignmentId,
        compMatrixCurrentRatings.compMatrixDefinitionId,
      ],
      set: updateFields,
    });
}
