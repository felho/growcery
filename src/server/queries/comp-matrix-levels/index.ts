import { compMatrixLevels } from "~/server/db/schema";
import { reorderLevels } from "./reorder";

export type Level = typeof compMatrixLevels.$inferSelect;
export type NewLevel = typeof compMatrixLevels.$inferInsert;

export type ReorderLevelsInput = {
  matrixId: number;
  levels: Array<{
    id: number;
    numericLevel: number;
  }>;
};

export type ReorderLevelsOutput = Level[];

export { reorderLevels };
