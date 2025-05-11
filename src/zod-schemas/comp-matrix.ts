import { z } from "zod";

export const createCompMatrixSchema = z.object({
  title: z.string().min(1).max(250),
  functionId: z.number().int().positive(),
  isPublished: z.boolean(),
});

export type CreateCompMatrixPayload = z.infer<typeof createCompMatrixSchema>;
