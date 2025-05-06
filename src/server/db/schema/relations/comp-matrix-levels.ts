import { relations } from "drizzle-orm";
import { compMatrixLevels } from "../tables/comp-matrix-levels";
import { compMatrices } from "../tables/comp-matrices";
import { compMatrixDefinitions } from "../tables/comp-matrix-definitions";

export const compMatrixLevelRelations = relations(
  compMatrixLevels,
  ({ one, many }) => ({
    matrix: one(compMatrices, {
      fields: [compMatrixLevels.compMatrixId],
      references: [compMatrices.id],
    }),
    definitions: many(compMatrixDefinitions),
  }),
);
