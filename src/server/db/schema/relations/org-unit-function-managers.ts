import { relations } from "drizzle-orm";
import { orgUnitFunctionManagers } from "../tables/org-unit-function-managers";
import { orgUnits } from "../tables/org-units";
import { functions } from "../tables/functions";
import { users } from "../tables/users";

export const orgUnitFunctionManagerRelations = relations(
  orgUnitFunctionManagers,
  ({ one }) => ({
    orgUnit: one(orgUnits, {
      fields: [orgUnitFunctionManagers.orgUnitId],
      references: [orgUnits.id],
    }),
    function: one(functions, {
      fields: [orgUnitFunctionManagers.functionId],
      references: [functions.id],
    }),
    manager: one(users, {
      fields: [orgUnitFunctionManagers.managerUserId],
      references: [users.id],
    }),
  }),
);
