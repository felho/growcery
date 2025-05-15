import { z } from "zod";

export const upsertCompMatrixDefinitionSchema = z
  .object({
    compMatrixCompetencyId: z.number().int().positive(),
    compMatrixLevelId: z.number().int().positive(),
    definition: z.string(),
    assessmentHint: z.string().max(5000).optional().nullable(),
    inheritsPreviousLevel: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      const inherits = data.inheritsPreviousLevel ?? false;
      const hasDefinition =
        data.definition && data.definition.trim().length > 0;
      return inherits || hasDefinition;
    },
    {
      message: "Definition is required when not inheriting from previous level",
      path: ["definition"],
    },
  );
