import { z } from "zod";

export const compMatrixCellSaveSchema = z.object({
  assignmentId: z.number().int().positive(),
  definitionId: z.number().int().positive(),
  ratingId: z.number().int().nullable(),
  comment: z.string().max(1000).nullable(),
  raterType: z.enum(["employee", "manager"]),
});

export type CompMatrixCellSavePayloadAPI = z.infer<
  typeof compMatrixCellSaveSchema
>;
