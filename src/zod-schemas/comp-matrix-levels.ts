import { z } from "zod";

export const reorderLevelsSchema = z.object({
  matrixId: z.number(),
  levels: z.array(
    z.object({
      id: z.number(),
      numericLevel: z.number(),
    }),
  ),
});

export type ReorderLevelsInput = z.infer<typeof reorderLevelsSchema>;
export type ReorderLevelsOutput = z.infer<typeof reorderLevelsSchema>;
