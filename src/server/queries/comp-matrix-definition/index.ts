import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixDefinitions } from "~/server/db/schema";

export type CompMatrixDefinition = InferSelectModel<
  typeof compMatrixDefinitions
>;

export type NewCompMatrixDefinition = InferInsertModel<
  typeof compMatrixDefinitions
>;

export type UpsertCompMatrixDefinition = Omit<
  InferInsertModel<typeof compMatrixDefinitions>,
  "id"
>;

export { upsertCompMatrixDefinition } from "./upsert";
