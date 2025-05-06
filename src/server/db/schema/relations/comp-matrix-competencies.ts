import { relations } from "drizzle-orm";
import { compMatrixCompetencies } from "../tables/comp-matrix-competencies";
import { compMatrixAreas } from "../tables/comp-matrix-areas";

export const compMatrixCompetencyRelations = relations(
  compMatrixCompetencies,
  ({ one }) => ({
    area: one(compMatrixAreas, {
      fields: [compMatrixCompetencies.compMatrixAreaId],
      references: [compMatrixAreas.id],
    }),
  }),
);
