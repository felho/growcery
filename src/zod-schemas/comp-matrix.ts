import { z } from "zod";

export const createCompMatrixSchema = z.object({
  title: z.string().min(1),
  functionId: z.number(),
  isPublished: z.boolean().default(false),
  levelCode: z.string().max(10).default("L"),
});

export const updateCompMatrixSchema = z.object({
  title: z.string().min(1),
  functionId: z.number(),
  isPublished: z.boolean(),
  levelCode: z.string().max(10),
});

export type CreateCompMatrixPayload = z.infer<typeof createCompMatrixSchema>;
export type UpdateCompMatrixPayload = z.infer<typeof updateCompMatrixSchema>;
