import { compMatrixLevels } from "~/server/db/schema";
import { reorderLevels } from "./reorder";
import { updateLevel } from "./update";

export type CompMatrixLevel = typeof compMatrixLevels.$inferSelect;
export type NewCompMatrixLevel = typeof compMatrixLevels.$inferInsert;

export type ReorderCompMatrixLevelsInput = {
  matrixId: number;
  levels: Array<{
    id: number;
    numericLevel: number;
  }>;
};

export type UpdateLevelInput = {
  levelId: number;
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
};

export { reorderLevels };
export { updateLevel };
