import { sql } from "drizzle-orm";
import { bigint, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";
import { users } from "./users";

export const managerGroups = createTable("growcery_manager_groups", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  name: varchar({ length: 250 }).notNull(),
  description: varchar({ length: 500 }),
  createdBy: bigint({ mode: "number" })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .$onUpdate(() => new Date())
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
