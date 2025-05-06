import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixCompetencies } from "~/server/db/schema";
import type { CompMatrixDefinition } from "../comp-matrix-definition";

export type CompMatrixCompetency = InferSelectModel<
  typeof compMatrixCompetencies
>;

export type NewCompMatrixCompetency = InferInsertModel<
  typeof compMatrixCompetencies
>;

export interface CompMatrixCompetencyWithDefinitions
  extends CompMatrixCompetency {
  definitions: CompMatrixDefinition[];
}
