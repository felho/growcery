import { relations } from "drizzle-orm";
import { managerGroups } from "../tables/manager-groups";
import { organizations } from "../tables/organizations";
import { users } from "../tables/users";
import { managerGroupMembers } from "../tables/manager-group-members";

export const managerGroupRelations = relations(managerGroups, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [managerGroups.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [managerGroups.createdBy],
    references: [users.id],
  }),
  members: many(managerGroupMembers),
}));
