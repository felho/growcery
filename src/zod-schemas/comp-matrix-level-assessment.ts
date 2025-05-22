import { z } from "zod";

export const compMatrixLevelAssessmentSchema = z.object({
  userCompMatrixAssignmentId: z.number(),
  compMatrixId: z.number(),
  isGeneral: z.boolean(),
  compMatrixAreaId: z.number().optional(),
  mainLevel: z.number().min(1),
  subLevel: z.number().min(1).max(3),
});

export type CompMatrixLevelAssessment = z.infer<
  typeof compMatrixLevelAssessmentSchema
>;

// Schema for creating/updating from the client
export const createCompMatrixLevelAssessmentSchema =
  compMatrixLevelAssessmentSchema;
