import { relations } from "drizzle-orm";
import { compMatrixCurrentState } from "../tables/comp-matrix-current-state";
import { users } from "../tables/users";
import { compMatrixDefinitions } from "../tables/comp-matrix-definitions";
import { compMatrixRatingOptions } from "../tables/comp-matrix-ratings";

export const compMatrixCurrentStateRelations = relations(
  compMatrixCurrentState,
  ({ one }) => ({
    reviewee: one(users, {
      fields: [compMatrixCurrentState.revieweeId],
      references: [users.id],
    }),
    definition: one(compMatrixDefinitions, {
      fields: [compMatrixCurrentState.compMatrixDefinitionId],
      references: [compMatrixDefinitions.id],
    }),
    selfRating: one(compMatrixRatingOptions, {
      fields: [compMatrixCurrentState.selfRatingId],
      references: [compMatrixRatingOptions.id],
    }),
    manager: one(users, {
      fields: [compMatrixCurrentState.managerId],
      references: [users.id],
    }),
    managerRating: one(compMatrixRatingOptions, {
      fields: [compMatrixCurrentState.managerRatingId],
      references: [compMatrixRatingOptions.id],
    }),
  }),
);
