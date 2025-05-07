import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";

// Base types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Joined types
export type UserWithArchetype = User & {
  archetype: InferSelectModel<typeof userArchetypes> | null;
};

// Query exports
export * from "./get-by-id";
export * from "./get-by-auth-id";
export * from "./get-all-by-org";
export * from "./create";
export * from "./update";
export * from "./create-on-first-login";
