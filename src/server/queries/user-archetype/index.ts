import type { InferSelectModel } from "drizzle-orm";
import { userArchetypes } from "~/server/db/schema";

export type UserArchetype = InferSelectModel<typeof userArchetypes>;

export * from "./get-all-by-org";
export * from "./get-by-id";
export * from "./create";
export * from "./update";
