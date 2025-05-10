import { bigint, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";
import { functions } from "./functions";
import { sql } from "drizzle-orm";

export const compMatrices = createTable("comp_matrices", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  functionId: bigint({ mode: "number" })
    .notNull()
    .references(() => functions.id),
  title: varchar({ length: 250 }).notNull(),
  isPublished: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
