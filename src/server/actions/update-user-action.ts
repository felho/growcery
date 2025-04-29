"use server";

import { actionClient } from "../../lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateUserSchema, type UpdateUserInput } from "../../zod-schemas/user";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const updateUserAction = actionClient
  .metadata({ actionName: "updateUserAction" })
  .schema(updateUserSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }: { parsedInput: UpdateUserInput }) => {
    const updated = await db
      .update(users)
      .set({
        fullName: parsedInput.fullName,
        email: parsedInput.email,
        functionId: parsedInput.functionId ?? null,
        managerId: parsedInput.managerId ?? null,
        orgUnitId: parsedInput.orgUnitId ?? null,
      })
      .where(eq(users.id, parsedInput.id))
      .returning({ id: users.id });

    if (!updated || updated.length === 0) {
      throw new Error(
        `User update failed: No user with ID ${parsedInput.id} found.`,
      );
    }
    return { message: `User #${updated[0]!.id} updated successfully.` };
  });
