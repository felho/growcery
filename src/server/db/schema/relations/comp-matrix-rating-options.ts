import { relations } from "drizzle-orm";
import { compMatrixRatingOptions } from "../tables/comp-matrix-ratings";
import { compMatrices } from "../tables/comp-matrices";

export const compMatrixRatingOptionRelations = relations(
  compMatrixRatingOptions,
  ({ one }) => ({
    matrix: one(compMatrices, {
      fields: [compMatrixRatingOptions.competencyMatrixId],
      references: [compMatrices.id],
    }),
  }),
);
