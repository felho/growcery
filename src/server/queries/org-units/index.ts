import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { orgUnits } from "~/server/db/schema";

export type OrgUnit = InferSelectModel<typeof orgUnits>;
export type NewOrgUnit = InferInsertModel<typeof orgUnits>;

export * from "./get-by-id";
export * from "./get-all-by-org";
export * from "./create";
export * from "./update";
