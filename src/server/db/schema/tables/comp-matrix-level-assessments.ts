import {
  boolean,
  integer,
  bigint,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { compMatrices } from "./comp-matrices";
import { userCompMatrixAssignments } from "./user_comp_matrix_assignments";
import { compMatrixAreas } from "./comp-matrix-areas";
import { sql } from "drizzle-orm";

export const compMatrixLevelAssessments = createTable(
  "comp_matrix_level_assessments",
  {
    id: bigint({ mode: "number" })
      .primaryKey()
      .notNull()
      .generatedByDefaultAsIdentity(),
    userCompMatrixAssignmentId: bigint({ mode: "number" })
      .notNull()
      .references(() => userCompMatrixAssignments.id),
    compMatrixId: bigint({ mode: "number" })
      .notNull()
      .references(() => compMatrices.id),
    isGeneral: boolean().notNull(),
    compMatrixAreaId: bigint({ mode: "number" }).references(
      () => compMatrixAreas.id,
    ),
    mainLevel: integer().notNull(),
    subLevel: integer().notNull(),
    createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    // This one is needed to make the upsert work
    uniqueIndex("uq_level_assessment").on(
      t.userCompMatrixAssignmentId,
      t.isGeneral,
      t.compMatrixAreaId,
    ),
    uniqueIndex("uq_general_rating")
      .on(t.userCompMatrixAssignmentId)
      .where(sql`${t.isGeneral} = true`),
    uniqueIndex("uq_area_rating")
      .on(t.userCompMatrixAssignmentId, t.compMatrixAreaId)
      .where(sql`${t.isGeneral} = false`),
  ],
);
