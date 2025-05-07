import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixRatingOptions } from "~/server/db/schema";

export type CompMatrixRatingOption = InferSelectModel<
  typeof compMatrixRatingOptions
>;
export type NewCompMatrixRatingOption = InferInsertModel<
  typeof compMatrixRatingOptions
>;
