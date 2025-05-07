import { relations } from "drizzle-orm";
import { userCompMatrixAssignments } from "../tables/user_comp_matrix_assignments";
import { users } from "../tables/users";
import { compMatrices } from "../tables/comp-matrices";

export const userCompMatrixAssignmentRelations = relations(
  userCompMatrixAssignments,
  ({ one }) => ({
    reviewee: one(users, {
      fields: [userCompMatrixAssignments.revieweeId],
      references: [users.id],
    }),
    compMatrix: one(compMatrices, {
      fields: [userCompMatrixAssignments.compMatrixId],
      references: [compMatrices.id],
    }),
    creator: one(users, {
      fields: [userCompMatrixAssignments.createdBy],
      references: [users.id],
    }),
  }),
);
