import { relations } from "drizzle-orm";
import { orgUnits } from "../tables/org-units";
import { organizations } from "../tables/organizations";

export const orgUnitRelations = relations(orgUnits, ({ one }) => ({
  organization: one(organizations, {
    fields: [orgUnits.organizationId],
    references: [organizations.id],
  }),
  parent: one(orgUnits, {
    fields: [orgUnits.parentId],
    references: [orgUnits.id],
  }),
}));
