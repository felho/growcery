import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixCurrentState } from "~/server/db/schema";

export type CompMatrixCurrentState = InferSelectModel<
  typeof compMatrixCurrentState
>;
export type NewCompMatrixCurrentState = InferInsertModel<
  typeof compMatrixCurrentState
>;
