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

export type CompMatrixRatingOptionUI = Omit<
  CompMatrixRatingOption,
  "competencyMatrixId" | "sortOrder"
>;

export type NewCompMatrixRatingOptionUI = Omit<
  NewCompMatrixRatingOption,
  "id" | "competencyMatrixId" | "sortOrder"
>;

export type CompMatrixRatingOptionReorderUI = Omit<
  InferSelectModel<typeof compMatrixRatingOptions>,
  "competencyMatrixId"
>;

export { reorderCompMatrixRatingOptions } from "./reorder";
export { createCompMatrixRatingOption } from "./create";
export { updateCompMatrixRatingOption } from "./update";
export { deleteCompMatrixRatingOption } from "./delete";
export { getRatingOptionsByMatrixId } from "./get-by-matrix-id";
