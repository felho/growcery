import { bigint, smallint, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { compMatrixAreas } from "./comp-matrix-areas";

export const compMatrixCompetencies = createTable("comp-matrix-competencies", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  compMatrixAreaId: bigint({ mode: "number" })
    .notNull()
    .references(() => compMatrixAreas.id),
  title: varchar({ length: 100 }).notNull(),
  calculationWeight: smallint(),
  sortOrder: smallint().notNull(),
});
