import { bigint, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";

export const functions = createTable("functions", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  name: varchar({ length: 250 }).notNull(),
  description: varchar({ length: 500 }),
});
