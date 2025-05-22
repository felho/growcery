import { z } from "zod";

const baseLevelFields = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be at most 1000 characters"),
  persona: z
    .string()
    .min(1, "Persona is required")
    .max(50, "Persona must be at most 50 characters"),
  areaOfImpact: z
    .string()
    .min(1, "Area of Impact is required")
    .max(200, "Area of Impact must be at most 200 characters"),
};

export const createLevelSchemaFromForm = z.object({
  ...baseLevelFields,
  insertPosition: z.number().optional(),
});

export const createLevelSchema = z.object({
  ...baseLevelFields,
  matrixId: z.number(),
  insertPosition: z.number().optional(),
});

export const reorderLevelsSchema = z.object({
  matrixId: z.number(),
  levels: z.array(
    z.object({
      id: z.number(),
      numericLevel: z.number(),
    }),
  ),
});

export const updateLevelSchema = z.object({
  levelId: z.number(),
  ...baseLevelFields,
});

export const deleteLevelSchema = z.object({
  matrixId: z.number(),
  levelId: z.number(),
});

export type CreateLevelInputFromForm = z.infer<
  typeof createLevelSchemaFromForm
>;
export type CreateLevelInput = z.infer<typeof createLevelSchema>;
export type ReorderLevelsInput = z.infer<typeof reorderLevelsSchema>;
export type ReorderLevelsOutput = z.infer<typeof reorderLevelsSchema>;
export type UpdateLevelInput = z.infer<typeof updateLevelSchema>;
export type DeleteLevelInput = z.infer<typeof deleteLevelSchema>;
