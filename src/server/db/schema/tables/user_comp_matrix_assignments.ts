import { bigint, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { users } from "./users";
import { compMatrices } from "./comp-matrices";
import { eq, sql } from "drizzle-orm";

export const userCompMatrixAssignments = createTable(
  "user_comp_matrix_assignments",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    revieweeId: bigint({ mode: "number" })
      .notNull()
      .references(() => users.id),
    compMatrixId: bigint({ mode: "number" })
      .notNull()
      .references(() => compMatrices.id),
    isActive: boolean().notNull().default(true),
    createdBy: bigint({ mode: "number" })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_active_matrix_per_user")
      .on(table.revieweeId)
      .where(sql`"isActive" = true`),
  ],
);
