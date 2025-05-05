import { relations } from "drizzle-orm";
import { userArchetypes } from "../tables/user-archetypes";
import { organizations } from "../tables/organizations";

export const userArchetypeRelations = relations(userArchetypes, ({ one }) => ({
  organization: one(organizations, {
    fields: [userArchetypes.organizationId],
    references: [organizations.id],
  }),
}));
