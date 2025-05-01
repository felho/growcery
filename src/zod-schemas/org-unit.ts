import { z } from "zod";

export const insertOrgUnitSchemaFromForm = z.object({
  name: z.string().min(1, "Name is required").max(250),
  description: z.string().max(500).optional(),
  parentId: z.coerce.number().int().optional(),
});

// In server action we need the organizationId
export const insertOrgUnitSchema = insertOrgUnitSchemaFromForm.extend({
  organizationId: z.number().int(),
});

export const updateOrgUnitSchema = insertOrgUnitSchemaFromForm.extend({
  id: z.number().int(),
});

export type InsertOrgUnitInputFromForm = z.infer<
  typeof insertOrgUnitSchemaFromForm
>;
export type InsertOrgUnitInput = z.infer<typeof insertOrgUnitSchema>;
export type UpdateOrgUnitInput = z.infer<typeof updateOrgUnitSchema>;
