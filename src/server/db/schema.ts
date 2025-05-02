// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  primaryKey,
  index,
  pgTableCreator,
  varchar,
  bigint,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `growcery_${name}`);

export const users = createTable("users", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  authProviderId: varchar({ length: 500 }),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  fullName: varchar({ length: 250 }).notNull(),
  email: varchar({ length: 500 }).notNull().unique(),
  functionId: bigint({ mode: "number" }),
  managerId: bigint({ mode: "number" }),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const organizations = createTable("organizations", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 250 }).notNull(),
});

export const orgEmailDomain = createTable(
  "org_email_domains",
  {
    organizationId: bigint("organization_id", { mode: "number" }).references(
      () => organizations.id,
    ),
    emailDomain: varchar("email_domain", { length: 500 }),
  },
  (table) => [
    primaryKey({ columns: [table.organizationId, table.emailDomain] }),
  ],
);

export const functions = createTable("functions", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  name: varchar({ length: 250 }).notNull(),
  description: varchar({ length: 2000 }),
});

export const orgUnits = createTable("org_units", (t) => ({
  id: t.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: t
    .bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  name: t.varchar({ length: 250 }).notNull(),
  description: t.varchar({ length: 500 }),
  parentId: t
    .bigint({ mode: "number" })
    .references((): AnyPgColumn => orgUnits.id),
}));

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
