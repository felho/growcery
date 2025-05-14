import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixRatingOptions } from "~/server/db/schema";

export type CompMatrixRatingOption = Omit<
  InferSelectModel<typeof compMatrixRatingOptions>,
  "sortOrder"
>;
export type NewCompMatrixRatingOption = Omit<
  InferInsertModel<typeof compMatrixRatingOptions>,
  "sortOrder"
>;

export type NewCompMatrixRatingOptionUI = Omit<
  NewCompMatrixRatingOption,
  "id" | "competencyMatrixId" | "sortOrder"
>;
