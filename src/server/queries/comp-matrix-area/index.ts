import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixAreas } from "~/server/db/schema";
import type { CompMatrixCompetency } from "../comp-matrix-competency";
import type { CompMatrixDefinition } from "../comp-matrix-definition";

export type CompMatrixArea = InferSelectModel<typeof compMatrixAreas>;

export type NewCompMatrixArea = InferInsertModel<typeof compMatrixAreas>;

export interface CompMatrixAreaWithFullRelations extends CompMatrixArea {
  competencies: Array<
    CompMatrixCompetency & {
      definitions: CompMatrixDefinition[];
    }
  >;
}

export { createCompMatrixArea } from "./create";
