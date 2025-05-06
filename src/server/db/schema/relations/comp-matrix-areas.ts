import { relations } from "drizzle-orm";
import { compMatrixAreas } from "../tables/comp-matrix-areas";
import { compMatrices } from "../tables/comp-matrices";
import { compMatrixCompetencies } from "../tables/comp-matrix-competencies";

export const compMatrixAreaRelations = relations(
  compMatrixAreas,
  ({ one, many }) => ({
    matrix: one(compMatrices, {
      fields: [compMatrixAreas.compMatrixId],
      references: [compMatrices.id],
    }),
    competencies: many(compMatrixCompetencies),
  }),
);
