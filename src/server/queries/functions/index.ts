import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { functions } from "~/server/db/schema";

export type Function = InferSelectModel<typeof functions>;
export type NewFunction = InferInsertModel<typeof functions>;

export * from "./get-by-id";
export * from "./get-all-by-org";
export * from "./create";
export * from "./update";
