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

// organizationId is only added on the server side
export const insertUserArchetypeSchemaFromForm = z.object(baseFields);

// organizationId is only added on the server side
export const updateUserArchetypeSchemaFromForm = z
  .object({ id: z.number().int() })
  .merge(z.object(baseFields));

export const insertUserArchetypeSchema = z
  .object({
    organizationId: z.number().int(),
  })
  .merge(z.object(baseFields));

export const updateUserArchetypeSchema = z
  .object({
    id: z.number().int(),
    organizationId: z.number().int(),
  })
  .merge(z.object(baseFields));

export type InsertUserArchetypeInputFromForm = z.infer<
  typeof insertUserArchetypeSchemaFromForm
>;
export type UpdateUserArchetypeInputFromForm = z.infer<
  typeof updateUserArchetypeSchemaFromForm
>;
export type InsertUserArchetypeInput = z.infer<
  typeof insertUserArchetypeSchema
>;
export type UpdateUserArchetypeInput = z.infer<
  typeof updateUserArchetypeSchema
>;
