import { z } from "zod";

export const createRatingOptionSchema = z.object({
  competencyMatrixId: z.number(),
  title: z.string().min(1).max(250),
  radioButtonLabel: z.string().min(1).max(50),
  definition: z.string().min(1).max(500),
  calculationWeight: z.number().min(0).max(100),
  color: z.string().min(1).max(10),
});

export const updateRatingOptionSchema = createRatingOptionSchema.extend({
  id: z.number(),
});

export const deleteRatingOptionSchema = z.object({
  id: z.number(),
});

export const reorderRatingOptionsSchema = z.object({
  matrixId: z.number(),
  ratingOptions: z.array(
    z.object({
      id: z.number(),
      sortOrder: z.number(),
    }),
  ),
});
