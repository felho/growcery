import { z } from "zod";

export const createCompMatrixAreaSchema = z.object({
  compMatrixId: z.number(),
  title: z.string().min(1, "Title is required").max(100),
  shortDescription: z.string().max(200).optional(),
});

export type CreateCompMatrixAreaInput = z.infer<
  typeof createCompMatrixAreaSchema
>;
