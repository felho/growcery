import { relations } from "drizzle-orm";
import { compMatrixCompetencies } from "../tables/comp-matrix-competencies";
import { compMatrixAreas } from "../tables/comp-matrix-areas";
import { compMatrixDefinitions } from "../tables/comp-matrix-definitions";

export const compMatrixCompetencyRelations = relations(
  compMatrixCompetencies,
  ({ one, many }) => ({
    area: one(compMatrixAreas, {
      fields: [compMatrixCompetencies.compMatrixAreaId],
      references: [compMatrixAreas.id],
    }),
    definitions: many(compMatrixDefinitions),
  }),
);
