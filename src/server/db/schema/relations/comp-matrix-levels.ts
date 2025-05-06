import { relations } from "drizzle-orm";
import { compMatrixLevels } from "../tables/comp-matrix-levels";
import { compMatrices } from "../tables/comp-matrices";

export const compMatrixLevelRelations = relations(
  compMatrixLevels,
  ({ one }) => ({
    matrix: one(compMatrices, {
      fields: [compMatrixLevels.compMatrixId],
      references: [compMatrices.id],
    }),
  }),
);
