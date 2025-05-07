import { bigint, varchar, smallint } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { compMatrices } from "./comp-matrices";

export const compMatrixRatingOptions = createTable(
  "comp_matrix_rating_option",
  {
    id: bigint({ mode: "number" })
      .primaryKey()
      .notNull()
      .generatedByDefaultAsIdentity(),
    competencyMatrixId: bigint({ mode: "number" })
      .notNull()
      .references(() => compMatrices.id),
    title: varchar({ length: 250 }).notNull(),
    definition: varchar({ length: 500 }).notNull(),
    calculationWeight: smallint().notNull(),
  },
);
