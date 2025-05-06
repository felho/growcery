import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixAreas } from "~/server/db/schema";
import type { CompMatrixCompetency } from "../comp-matrix-competency";

export type CompMatrixArea = InferSelectModel<typeof compMatrixAreas>;

export type NewCompMatrixArea = InferInsertModel<typeof compMatrixAreas>;

export interface CompMatrixAreaWithCompetencies extends CompMatrixArea {
  competencies: CompMatrixCompetency[];
}
