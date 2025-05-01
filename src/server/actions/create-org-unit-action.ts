"use server";

import { insertOrgUnitSchemaFromForm } from "~/zod-schemas/org-unit";
import { actionClient } from "~/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { createOrgUnit } from "~/server/queries";
import { z } from "zod";

export const createOrgUnitAction = actionClient
  .metadata({ actionName: "createOrgUnitAction" })
  .schema(insertOrgUnitSchemaFromForm.extend({ organizationId: z.number() }), {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { organizationId, parentId, ...rest } = parsedInput;

    const id = await createOrgUnit({
      ...rest,
      organizationId,
      parentId: parentId ?? undefined,
    });

    return { message: `Organizational unit ID #${id} created successfully` };
  });
