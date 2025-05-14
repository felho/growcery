import { z } from "zod";

export const createCompMatrixAreaSchema = z.object({
  compMatrixId: z.number(),
  title: z.string().min(1, "Title is required").max(100),
  shortDescription: z.string().max(200).optional(),
});

export const updateCompMatrixAreaSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(100),
  shortDescription: z.string().max(200).optional(),
});

export const deleteCompMatrixAreaSchema = z.object({
  id: z.number(),
});
