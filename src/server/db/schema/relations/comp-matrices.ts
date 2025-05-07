import { relations } from "drizzle-orm";
import { compMatrices } from "../tables/comp-matrices";
import { organizations } from "../tables/organizations";
import { functions } from "../tables/functions";
import { compMatrixAreas } from "../tables/comp-matrix-areas";
import { compMatrixLevels } from "../tables/comp-matrix-levels";
import { compMatrixRatingOptions } from "../tables/comp-matrix-rating-options";

export const compMatrixRelations = relations(compMatrices, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [compMatrices.organizationId],
    references: [organizations.id],
  }),
  function: one(functions, {
    fields: [compMatrices.functionId],
    references: [functions.id],
  }),
  areas: many(compMatrixAreas),
  levels: many(compMatrixLevels),
  ratingOptions: many(compMatrixRatingOptions),
}));
