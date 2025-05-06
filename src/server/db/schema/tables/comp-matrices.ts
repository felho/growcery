import { bigint, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { organizations } from "./organizations";
import { functions } from "./functions";

export const compMatrices = createTable("comp_matrices", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint({ mode: "number" })
    .notNull()
    .references(() => organizations.id),
  functionId: bigint({ mode: "number" })
    .notNull()
    .references(() => functions.id),
  title: varchar({ length: 250 }).notNull(),
});
