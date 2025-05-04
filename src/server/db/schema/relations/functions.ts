import { relations } from "drizzle-orm";
import { functions } from "../tables/functions";
import { organizations } from "../tables/organizations";

export const functionRelations = relations(functions, ({ one }) => ({
  organization: one(organizations, {
    fields: [functions.organizationId],
    references: [organizations.id],
  }),
}));
