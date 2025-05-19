import { relations } from "drizzle-orm";
import { compMatrixLevelAssessments } from "../tables/comp-matrix-level-assessments";
import { userCompMatrixAssignments } from "../tables/user_comp_matrix_assignments";
import { compMatrices } from "../tables/comp-matrices";
import { compMatrixAreas } from "../tables/comp-matrix-areas";

export const compMatrixLevelAssessmentsRelations = relations(
  compMatrixLevelAssessments,
  ({ one }) => ({
    assignment: one(userCompMatrixAssignments, {
      fields: [compMatrixLevelAssessments.userCompMatrixAssignmentId],
      references: [userCompMatrixAssignments.id],
    }),
    matrix: one(compMatrices, {
      fields: [compMatrixLevelAssessments.compMatrixId],
      references: [compMatrices.id],
    }),
    area: one(compMatrixAreas, {
      fields: [compMatrixLevelAssessments.compMatrixAreaId],
      references: [compMatrixAreas.id],
    }),
  }),
);
