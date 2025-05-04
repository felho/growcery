import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "~/server/db/schema";

// Típusok
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Queryk
export * from "./get-by-id";
export * from "./get-by-auth-id";
export * from "./get-all-by-org";
export * from "./create";
export * from "./update";
export * from "./create-on-first-login";
