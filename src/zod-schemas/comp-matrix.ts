import { z } from "zod";

export const createCompMatrixSchema = z.object({
  title: z.string().min(1),
  functionId: z.number(),
  isPublished: z.boolean().default(false),
});

export const updateCompMatrixSchema = z.object({
  title: z.string().min(1),
  functionId: z.number(),
  isPublished: z.boolean(),
});

export type CreateCompMatrixPayload = z.infer<typeof createCompMatrixSchema>;
export type UpdateCompMatrixPayload = z.infer<typeof updateCompMatrixSchema>;
