import { z } from "zod";

const baseUserFields = {
  fullName: z.string().min(1, "Full name cannot be empty"),
  email: z.string().email("Invalid email address"),
  functionId: z.number().optional(),
  managerId: z.number().optional(),
  orgUnitId: z.number().optional(),
};

export const insertUserSchemaFromForm = z.object(baseUserFields);

export const insertUserSchemaWithAuth = z.object({
  authProviderId: z.string().min(1, "Auth provider ID is required"),
  organizationId: z.number().int(),
  ...baseUserFields,
});

export const insertUserSchema = z.object({
  ...baseUserFields,
  organizationId: z.number().int(),
});

export const updateUserSchema = z
  .object({
    id: z.number().int(),
  })
  .merge(z.object(baseUserFields));

export type InsertUserInputFromForm = z.infer<typeof insertUserSchemaFromForm>;
export type InsertUserInputWithAuth = z.infer<typeof insertUserSchemaWithAuth>;
export type InsertUserInput = z.infer<typeof insertUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
