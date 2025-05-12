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

export const updateLevelSchema = z.object({
  levelId: z.number(),
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
});

export type ReorderLevelsInput = z.infer<typeof reorderLevelsSchema>;
export type ReorderLevelsOutput = z.infer<typeof reorderLevelsSchema>;
