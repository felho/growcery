import { sql } from "drizzle-orm";
import { bigint, varchar, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { users } from "./users";
import { compMatrixDefinitions } from "./comp-matrix-definitions";
import { compMatrixRatingOptions } from "./comp-matrix-rating-options";
import { userCompMatrixAssignments } from "./user_comp_matrix_assignments";
import { compMatrices } from "./comp-matrices";
export const compMatrixCurrentRatings = createTable(
  "comp_matrix_current_ratings",
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
    compMatrixDefinitionId: bigint({ mode: "number" })
      .notNull()
      .references(() => compMatrixDefinitions.id),
    selfRatingId: bigint({ mode: "number" }).references(
      () => compMatrixRatingOptions.id,
    ),
    selfComment: varchar({ length: 1000 }),
    selfRatingUpdatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
    managerId: bigint({ mode: "number" }).references(() => users.id),
    managerRatingId: bigint({ mode: "number" }).references(
      () => compMatrixRatingOptions.id,
    ),
    managerComment: varchar({ length: 1000 }),
    managerRatingUpdatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
);
