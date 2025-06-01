import { z } from "zod";

export const insertManagerGroupSchemaFromForm = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  members: z.array(z.string()).min(1, "At least one member must be selected"),
});

export type InsertManagerGroupInputFromForm = z.infer<typeof insertManagerGroupSchemaFromForm>;

export const updateManagerGroupSchema = insertManagerGroupSchemaFromForm.extend({
  id: z.number(),
});

export type UpdateManagerGroupInput = z.infer<typeof updateManagerGroupSchema>;
