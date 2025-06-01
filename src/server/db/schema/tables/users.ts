import { sql } from "drizzle-orm";
import {
  bigint,
  timestamp,
  varchar,
  type AnyPgColumn,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";
import { orgUnits } from "./org-units";
import { functions } from "./functions";
import { userArchetypes } from "./user-archetypes";

export const users = createTable(
  "users",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    authProviderId: varchar({ length: 500 }),
    organizationId: bigint({ mode: "number" })
      .notNull()
      .references(() => organizations.id),
    fullName: varchar({ length: 250 }).notNull(),
    email: varchar({ length: 500 }).notNull().unique(),
    isManager: boolean().notNull().default(false),
    orgUnitId: bigint({ mode: "number" }).references(() => orgUnits.id),
    functionId: bigint({ mode: "number" }).references(() => functions.id),
    archetypeId: bigint({ mode: "number" }).references(() => userArchetypes.id),
    managerId: bigint({ mode: "number" }).references(
      (): AnyPgColumn => users.id,
    ),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [index("users_auth_provider_id_idx").on(table.authProviderId)],
);
