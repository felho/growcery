import { relations } from "drizzle-orm";
import { compMatrixAreas } from "../tables/comp-matrix-areas";
import { compMatrices as compMatrices } from "../tables/comp-matrices";

export const compMatrixAreaRelations = relations(
  compMatrixAreas,
  ({ one }) => ({
    matrix: one(compMatrices, {
      fields: [compMatrixAreas.compMatrixId],
      references: [compMatrices.id],
    }),
  }),
);
