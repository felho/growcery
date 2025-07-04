import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixAreas } from "~/server/db/schema";
import type { CompMatrixCompetency } from "../comp-matrix-competency";
import type { CompMatrixDefinition } from "../comp-matrix-definition";

export type CompMatrixArea = InferSelectModel<typeof compMatrixAreas>;
export type CompMatrixAreaEditUI = Omit<
  CompMatrixArea,
  "compMatrixId" | "sortOrder"
>;

export type NewCompMatrixArea = InferInsertModel<typeof compMatrixAreas>;

export interface CompMatrixAreaWithFullRelations extends CompMatrixArea {
  competencies: Array<
    CompMatrixCompetency & {
      definitions: CompMatrixDefinition[];
    }
  >;
}

export type ReorderAreaInput = {
  id: number;
  sortOrder: number;
};

export { createCompMatrixArea } from "./create";
export { updateCompMatrixArea } from "./update";
export { deleteCompMatrixArea } from "./delete";
export { reorderCompMatrixAreas } from "./reorder";
