import { bigint, varchar, integer } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { compMatrices } from "./comp-matrices";

export const compMatrixAreas = createTable("comp_matrix_area", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  title: varchar({ length: 50 }).notNull(),
  shortDescription: varchar({ length: 200 }).notNull(),
  compMatrixId: bigint({ mode: "number" })
    .notNull()
    .references(() => compMatrices.id),
  sortOrder: integer("sort_order").notNull().default(0),
});
