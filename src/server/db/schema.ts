// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `growcery_${name}`);

export const users = createTable("users", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  authProviderId: d.varchar({ length: 512 }),
  full_name: d.varchar({ length: 256 }).notNull(),
  email: d.varchar({ length: 512 }).notNull(),
  functionId: d.integer(),
  managerId: d.integer(),
  orgUnitId: d.integer(),
  lastLoginAt: d.timestamp({ withTimezone: true }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));
