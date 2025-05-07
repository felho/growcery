import { relations } from "drizzle-orm";
import { users } from "../tables/users";
import { organizations } from "../tables/organizations";
import { orgUnits } from "../tables/org-units";
import { functions } from "../tables/functions";
import { userArchetypes } from "../tables/user-archetypes";
import { compMatrixCurrentRatings } from "../tables/comp-matrix-current-ratings";

export const userRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  orgUnit: one(orgUnits, {
    fields: [users.orgUnitId],
    references: [orgUnits.id],
  }),
  function: one(functions, {
    fields: [users.functionId],
    references: [functions.id],
  }),
  archetype: one(userArchetypes, {
    fields: [users.archetypeId],
    references: [userArchetypes.id],
  }),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
  }),
  compMatrixCurrentRatingsAsReviewee: many(compMatrixCurrentRatings),
  compMatrixCurrentRatingsAsManager: many(compMatrixCurrentRatings),
}));
