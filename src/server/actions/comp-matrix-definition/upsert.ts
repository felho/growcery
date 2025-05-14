"use server";

import { actionClient } from "~/lib/safe-action";
import { upsertCompMatrixDefinitionSchema } from "~/zod-schemas/comp-matrix-definition";
import { upsertCompMatrixDefinition } from "~/server/queries/comp-matrix-definition/upsert";

export const upsertCompMatrixDefinitionAction = actionClient
  .metadata({ actionName: "upsertCompMatrixDefinition" })
  .schema(upsertCompMatrixDefinitionSchema)
  .action(async ({ parsedInput }) => {
    const definition = await upsertCompMatrixDefinition(parsedInput);
    return { definition };
  });
