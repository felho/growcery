import { relations } from "drizzle-orm";
import { compMatrixCurrentRatings } from "../tables/comp-matrix-current-ratings";
import { users } from "../tables/users";
import { compMatrixDefinitions } from "../tables/comp-matrix-definitions";
import { compMatrixRatingOptions } from "../tables/comp-matrix-rating-options";
import { userCompMatrixAssignments } from "../tables/user_comp_matrix_assignments";

export const compMatrixCurrentRatingRelations = relations(
  compMatrixCurrentRatings,
  ({ one }) => ({
    userCompMatrixAssignment: one(userCompMatrixAssignments, {
      fields: [compMatrixCurrentRatings.userCompMatrixAssignmentId],
      references: [userCompMatrixAssignments.id],
    }),
    definition: one(compMatrixDefinitions, {
      fields: [compMatrixCurrentRatings.compMatrixDefinitionId],
      references: [compMatrixDefinitions.id],
    }),
    selfRating: one(compMatrixRatingOptions, {
      fields: [compMatrixCurrentRatings.selfRatingId],
      references: [compMatrixRatingOptions.id],
    }),
    manager: one(users, {
      fields: [compMatrixCurrentRatings.managerId],
      references: [users.id],
    }),
    managerRating: one(compMatrixRatingOptions, {
      fields: [compMatrixCurrentRatings.managerRatingId],
      references: [compMatrixRatingOptions.id],
    }),
  }),
);
