"use server";

import { actionClient } from "../../lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { insertUserSchema, type InsertUserInput } from "../../zod-schemas/user";
import { db } from "../db";
import { users } from "../db/schema";

export const createUserAction = actionClient
  .metadata({ actionName: "createUserAction" })
  .schema(insertUserSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }: { parsedInput: InsertUserInput }) => {
    const inserted = await db
      .insert(users)
      .values({
        fullName: parsedInput.fullName,
        email: parsedInput.email,
        functionId: parsedInput.functionId ?? null,
        managerId: parsedInput.managerId ?? null,
        orgUnitId: parsedInput.orgUnitId ?? null,
      })
      .returning({ id: users.id });

    if (!inserted || inserted.length === 0) {
      throw new Error("User creation failed: No user returned from database.");
    }
    return { message: `User #${inserted[0]!.id} created successfully.` };
  });
