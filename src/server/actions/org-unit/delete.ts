"use server";

import { z } from "zod";
import { actionClient } from "~/lib/safe-action";
import { deleteOrgUnit } from "~/server/queries/org-unit";

export const deleteOrgUnitAction = actionClient
  .metadata({ actionName: "deleteOrgUnitAction" })
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const id = await deleteOrgUnit(parsedInput.id);

    return {
      message: `Organizational unit ID #${id} deleted successfully`,
      id,
    };
  });
