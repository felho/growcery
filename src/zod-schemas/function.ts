import { z } from "zod";

const baseFields = {
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(250, "Name cannot be longer than 250 characters"),
  description: z
    .string()
    .max(500, "Description cannot be longer than 500 characters"),
};

// organiztionId is only added on the server side
export const insertFunctionSchemaFromForm = z.object(baseFields);

// organiztionId is only added on the server side
export const updateFunctionSchemaFromForm = z
  .object({ id: z.number().int() })
  .merge(z.object(baseFields));

export const insertFunctionSchema = z
  .object({
    organizationId: z.number().int(),
  })
  .merge(z.object(baseFields));

export const updateFunctionSchema = z
  .object({
    id: z.number().int(),
    organizationId: z.number().int(),
  })
  .merge(z.object(baseFields));

export const deleteFunctionSchema = z.object({
  id: z.number().int(),
});

export type InsertFunctionInputFromForm = z.infer<
  typeof insertFunctionSchemaFromForm
>;
export type InsertFunctionInput = z.infer<typeof insertFunctionSchema>;
export type UpdateFunctionInputFromForm = z.infer<
  typeof updateFunctionSchemaFromForm
>;
export type UpdateFunctionInput = z.infer<typeof updateFunctionSchema>;
export type DeleteFunctionInput = z.infer<typeof deleteFunctionSchema>;
