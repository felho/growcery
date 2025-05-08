import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixCurrentRatings } from "~/server/db/schema";

export type CompMatrixCurrentRating = InferSelectModel<
  typeof compMatrixCurrentRatings
>;
export type NewCompMatrixCurrentRating = InferInsertModel<
  typeof compMatrixCurrentRatings
>;

export type CompMatrixRatingsForUI = {
  selfRatingId?: number;
  selfComment: string | null;
  selfRatingUpdatedAt: Date;

  managerId: number | null;
  managerRatingId?: number;
  managerComment: string | null;
  managerRatingUpdatedAt: Date;
};

export type CompMatrixRatingsForUIMap = Record<number, CompMatrixRatingsForUI>;

export type CompMatrixCellSavePayloadUI = {
  definitionId: number;
  ratingId: number | null;
  comment: string | null;
};

export interface CompMatrixCellSavePayloadAPI
  extends CompMatrixCellSavePayloadUI {
  assignmentId: number;
  raterType: "employee" | "manager";
}
