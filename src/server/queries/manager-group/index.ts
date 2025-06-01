import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { managerGroups } from "~/server/db/schema/tables/manager-groups";
import type { User } from "~/server/queries/user";

// Base types
export type ManagerGroup = InferSelectModel<typeof managerGroups>;
export type NewManagerGroup = InferInsertModel<typeof managerGroups>;

// Joined types
export type ManagerGroupWithMembers = ManagerGroup & {
  members: User[];
};

// Query exports
export * from "./get-all-by-org";
