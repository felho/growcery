import { sql } from "drizzle-orm";
import { bigint, varchar, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { users } from "./users";
import { compMatrixDefinitions } from "./comp-matrix-definitions";
import { compMatrixRatingOptions } from "./comp-matrix-ratings";

export const compMatrixCurrentState = createTable("comp_matrix_current_state", {
  id: bigint({ mode: "number" })
    .primaryKey()
    .notNull()
    .generatedByDefaultAsIdentity(),
  revieweeId: bigint({ mode: "number" })
    .notNull()
    .references(() => users.id),
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
});
