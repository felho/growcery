import { sql } from "drizzle-orm";
import { bigint, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { managerGroups } from "./manager-groups";
import { users } from "./users";

export const managerGroupMembers = createTable("growcery_manager_group_members", {
  managerGroupId: bigint({ mode: "number" })
    .notNull()
    .references(() => managerGroups.id),
  userId: bigint({ mode: "number" })
    .notNull()
    .references(() => users.id),
  addedAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
