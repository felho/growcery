import { relations } from "drizzle-orm";
import { compMatrixRatings } from "../tables/comp-matrix-ratings";
import { compMatrices } from "../tables/comp-matrices";

export const compMatrixRatingRelations = relations(
  compMatrixRatings,
  ({ one }) => ({
    matrix: one(compMatrices, {
      fields: [compMatrixRatings.competencyMatrixId],
      references: [compMatrices.id],
    }),
  }),
);
