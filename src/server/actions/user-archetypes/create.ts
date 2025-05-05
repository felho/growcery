"use server";

import { insertUserArchetypeSchemaFromForm } from "~/zod-schemas/user-archetype";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { createUserArchetype } from "~/server/queries/user-archetypes";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export const createUserArchetypeAction = actionClient
  .metadata({ actionName: "createUserArchetypeAction" })
  .schema(insertUserArchetypeSchemaFromForm, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const organizationId = getCurrentUserOrgId();
    const id = await createUserArchetype({
      ...parsedInput,
      organizationId,
    });
    return { message: `Archetype ID #${id} created successfully` };
  });
