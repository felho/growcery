import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { compMatrixCompetencies } from "~/server/db/schema";
import type { CompMatrixDefinition } from "../comp-matrix-definition";

export type CompMatrixCompetency = InferSelectModel<
  typeof compMatrixCompetencies
>;

export type NewCompMatrixCompetency = Omit<
  InferInsertModel<typeof compMatrixCompetencies>,
  "sortOrder"
>;

export interface CompMatrixCompetencyWithDefinitions
  extends CompMatrixCompetency {
  definitions: CompMatrixDefinition[];
}

export { createCompMatrixCompetency } from "./create";
export { updateCompMatrixCompetency } from "./update";
export { deleteCompMatrixCompetency } from "./delete";
