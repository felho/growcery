import { relations } from "drizzle-orm";
import { managerGroupMembers } from "../tables/manager-group-members";
import { managerGroups } from "../tables/manager-groups";
import { users } from "../tables/users";

export const managerGroupMemberRelations = relations(managerGroupMembers, ({ one }) => ({
  managerGroup: one(managerGroups, {
    fields: [managerGroupMembers.managerGroupId],
    references: [managerGroups.id],
  }),
  user: one(users, {
    fields: [managerGroupMembers.userId],
    references: [users.id],
  }),
}));
