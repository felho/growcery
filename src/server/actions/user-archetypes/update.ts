"use server";

import { updateUserArchetypeSchemaFromForm } from "~/zod-schemas/user-archetype";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateUserArchetype } from "~/server/queries/user-archetypes";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export const updateUserArchetypeAction = actionClient
  .metadata({ actionName: "updateUserArchetypeAction" })
  .schema(updateUserArchetypeSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();
    const id = await updateUserArchetype({
      ...parsedInput,
      organizationId,
    });
    return { message: `Archetype ID #${id} updated successfully` };
  });
