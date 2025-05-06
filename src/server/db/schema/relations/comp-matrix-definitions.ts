import { relations } from "drizzle-orm";
import { compMatrixDefinitions } from "../tables/comp-matrix-definitions";
import { compMatrixCompetencies } from "../tables/comp-matrix-competencies";
import { compMatrixLevels } from "../tables/comp-matrix-levels";

export const compMatrixDefinitionRelations = relations(
  compMatrixDefinitions,
  ({ one }) => ({
    competency: one(compMatrixCompetencies, {
      fields: [compMatrixDefinitions.compMatrixCompetencyId],
      references: [compMatrixCompetencies.id],
    }),
    level: one(compMatrixLevels, {
      fields: [compMatrixDefinitions.compMatrixLevelId],
      references: [compMatrixLevels.id],
    }),
  }),
);
