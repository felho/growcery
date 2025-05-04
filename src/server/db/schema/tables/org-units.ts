import { bigint, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";

export const orgUnits = createTable("org_units", (t) => ({
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  name: varchar({ length: 250 }).notNull(),
  description: varchar({ length: 500 }),
  parentId: bigint({ mode: "number" }).references(
    (): AnyPgColumn => orgUnits.id,
  ),
}));
