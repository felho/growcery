import { z } from "zod";

const baseUserFields = {
  fullName: z.string().min(1, "Full name cannot be empty").max(250),
  email: z.string().email("Invalid email address").max(500),
  isManager: z.boolean().default(false),
  functionId: z.number().optional().nullable(),
  managerId: z.number().optional().nullable(),
  orgUnitId: z.number().optional().nullable(),
  archetypeId: z.number().optional().nullable(),
};

export const insertUserSchemaFromForm = z.object(baseUserFields);

export const insertUserSchemaWithAuth = z.object({
  authProviderId: z.string().min(1, "Auth provider ID is required").max(500),
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
  .merge(z.object(baseUserFields))
  .refine((data) => data.managerId !== data.id, {
    message: "A user cannot be their own manager",
    path: ["managerId"],
  });

export const deleteUserSchema = z.object({
  id: z.number().int(),
});

export type InsertUserInputFromForm = z.infer<typeof insertUserSchemaFromForm>;
export type InsertUserInputWithAuth = z.infer<typeof insertUserSchemaWithAuth>;
export type InsertUserInput = z.infer<typeof insertUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
