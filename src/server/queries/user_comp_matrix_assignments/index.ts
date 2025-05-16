import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { userCompMatrixAssignments } from "~/server/db/schema";

export type UserCompMatrixAssignment = InferSelectModel<
  typeof userCompMatrixAssignments
>;

export type NewUserCompMatrixAssignment = InferInsertModel<
  typeof userCompMatrixAssignments
>;

export * from "./create";
export * from "./get-active-by-user-id";
