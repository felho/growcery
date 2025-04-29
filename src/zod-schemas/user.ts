import { z } from "zod";

// Insert User Schema (Create form)
export const insertUserSchema = z.object({
  fullName: z.string().min(1, "Full name can not be empty"),
  email: z.string().email("Invalid email address"),
  functionId: z.number().optional(),
  managerId: z.number().optional(),
  orgUnitId: z.number().optional(),
});

// Update User Schema (Update form, id is required)
export const updateUserSchema = insertUserSchema.extend({
  id: z.number().int(),
});

// A típusok:
export type InsertUserInput = z.infer<typeof insertUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
