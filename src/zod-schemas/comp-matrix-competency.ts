import { z } from "zod";

export const createCompMatrixCompetencySchema = z.object({
  title: z.string().min(1, "Title is required"),
  compMatrixAreaId: z.number().int().positive(),
  calculationWeight: z.number().int().optional().nullable(),
});

export const updateCompMatrixCompetencySchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  calculationWeight: z.number().int().optional().nullable(),
});

export const deleteCompMatrixCompetencySchema = z.object({
  id: z.number(),
});

export const reorderCompMatrixCompetenciesSchema = z.object({
  areaId: z.number(),
  competencies: z
    .array(
      z.object({
        id: z.number(),
        sortOrder: z.number(),
      }),
    )
    .min(1),
});
