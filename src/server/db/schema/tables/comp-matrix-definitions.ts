import { boolean, bigint, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { compMatrixCompetencies } from "./comp-matrix-competencies";
import { compMatrixLevels } from "./comp-matrix-levels";

export const compMatrixDefinitions = createTable("comp_matrix_definitions", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  compMatrixCompetencyId: bigint({ mode: "number" })
    .notNull()
    .references(() => compMatrixCompetencies.id),
  compMatrixLevelId: bigint({ mode: "number" })
    .notNull()
    .references(() => compMatrixLevels.id),
  definition: varchar({ length: 1000 }).notNull(),
  assessmentHint: varchar({ length: 5000 }),
  inheritsPreviousLevel: boolean().default(false).notNull(),
});

// TODO: compMatrixCompetencyId + compMatrixLevelId together should be unique
