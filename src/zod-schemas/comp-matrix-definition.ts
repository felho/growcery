import { z } from "zod";

export const upsertCompMatrixDefinitionSchema = z.object({
  compMatrixCompetencyId: z.number().int().positive(),
  compMatrixLevelId: z.number().int().positive(),
  definition: z.string().min(1, "Definition is required"),
  assessmentHint: z.string().max(5000).optional().nullable(),
  inheritsPreviousLevel: z.boolean().optional(),
});
