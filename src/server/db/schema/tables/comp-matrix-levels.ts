import { bigint, varchar, integer } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { compMatrices } from "./comp-matrices";

export const compMatrixLevels = createTable("comp_matrix_level", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  compMatrixId: bigint({ mode: "number" })
    .notNull()
    .references(() => compMatrices.id),
  numericLevel: integer().notNull(),
  jobTitle: varchar({ length: 50 }).notNull(),
  levelCode: varchar({ length: 10 }).notNull(),
  persona: varchar({ length: 50 }),
  roleSummary: varchar({ length: 1000 }).notNull(),
  areaOfImpact: varchar({ length: 200 }),
});
