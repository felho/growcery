import { bigint, timestamp, boolean } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { users } from "./users";
import { compMatrices } from "./comp-matrices";
import { sql } from "drizzle-orm";

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
  (table) => ({
    uniqueActiveMatrixPerUser: sql`
      CREATE UNIQUE INDEX unique_active_matrix_per_user 
      ON user_comp_matrix_assignments (reviewee_id) 
      WHERE is_active = true
    `,
  }),
);
