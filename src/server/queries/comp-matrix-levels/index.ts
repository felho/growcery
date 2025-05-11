import { compMatrixLevels } from "~/server/db/schema";
import { reorderLevels } from "./reorder";

export type CompMatrixLevel = typeof compMatrixLevels.$inferSelect;
export type NewCompMatrixLevel = typeof compMatrixLevels.$inferInsert;

export type ReorderCompMatrixLevelsInput = {
  matrixId: number;
  levels: Array<{
    id: number;
    numericLevel: number;
  }>;
};

export { reorderLevels };
