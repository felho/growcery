import { relations } from "drizzle-orm";
import { compMatrices as compMatrices } from "../tables/comp-matrices";
import { organizations } from "../tables/organizations";
import { functions } from "../tables/functions";

export const compMatrixRelations = relations(compMatrices, ({ one }) => ({
  organization: one(organizations, {
    fields: [compMatrices.organizationId],
    references: [organizations.id],
  }),
  function: one(functions, {
    fields: [compMatrices.functionId],
    references: [functions.id],
  }),
}));
