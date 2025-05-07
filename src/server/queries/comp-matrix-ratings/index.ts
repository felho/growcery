import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixRatings } from "~/server/db/schema";

export type CompMatrixRating = InferSelectModel<typeof compMatrixRatings>;

export type NewCompMatrixRating = InferInsertModel<typeof compMatrixRatings>;
