import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrices } from "~/server/db/schema";
import type { CompMatrixArea } from "../comp-matrix-area";
import type { CompMatrixLevel } from "../comp-matrix-level";
import type { CompMatrixCompetency } from "../comp-matrix-competency";
import type { CompMatrixDefinition } from "../comp-matrix-definition";
import type { CompMatrixRatingOption } from "../comp-matrix-rating-option";

export type CompMatrix = InferSelectModel<typeof compMatrices>;

export type NewCompMatrix = InferInsertModel<typeof compMatrices>;

export interface CompMatrixWithRelations extends CompMatrix {
  areas: CompMatrixArea[];
  levels: CompMatrixLevel[];
}

export interface CompMatrixWithFullRelations extends CompMatrix {
  areas: Array<
    CompMatrixArea & {
      competencies: Array<
        CompMatrixCompetency & {
          definitions: CompMatrixDefinition[];
        }
      >;
    }
  >;
  levels: CompMatrixLevel[];
  ratingOptions: CompMatrixRatingOption[];
}
