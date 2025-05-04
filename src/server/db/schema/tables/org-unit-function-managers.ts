import { bigint, primaryKey } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { users } from "./users";
import { functions } from "./functions";
import { orgUnits } from "./org-units";

export const orgUnitFunctionManagers = createTable(
  "org_unit_function_managers",
  {
    orgUnitId: bigint("org_unit_id", { mode: "number" })
      .notNull()
      .references(() => orgUnits.id),
    functionId: bigint("function_id", { mode: "number" })
      .notNull()
      .references(() => functions.id),
    managerUserId: bigint("manager_user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    primaryKey({
      columns: [table.orgUnitId, table.functionId, table.managerUserId],
    }),
  ],
);
