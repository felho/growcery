import { db } from "~/server/db";
import { compMatrixDefinitions } from "~/server/db/schema/tables/comp-matrix-definitions";
import { compMatrixLevels } from "~/server/db/schema/tables/comp-matrix-levels";
import type { CompMatrixWithFullRelations } from "./index";
import { eq, asc } from "drizzle-orm";

export async function getCompMatrixById(
  matrixId: number,
): Promise<CompMatrixWithFullRelations | undefined> {
  // We include definitions in this query as otherwise it is hard
  // to add defintions in a type safe way
  const matrix = await db.query.compMatrices.findFirst({
    where: (m, { eq }) => eq(m.id, matrixId),
    with: {
      areas: {
        orderBy: (areas, { asc }) => [asc(areas.sortOrder)],
        with: {
          competencies: {
            orderBy: (competencies, { asc }) => [asc(competencies.sortOrder)],
            with: {
              definitions: true,
            },
          },
        },
      },
      levels: {
        orderBy: (levels, { asc }) => [asc(levels.numericLevel)],
      },
      ratingOptions: {
        orderBy: (ratingOptions, { asc }) => [asc(ratingOptions.sortOrder)],
      },
    },
  });

  if (!matrix) return undefined;

  // We query the defintions ordered by competency + level.numericLevel
  const sortedDefinitions = await db
    .select({
      id: compMatrixDefinitions.id,
      compMatrixCompetencyId: compMatrixDefinitions.compMatrixCompetencyId,
      compMatrixLevelId: compMatrixDefinitions.compMatrixLevelId,
      definition: compMatrixDefinitions.definition,
      assessmentHint: compMatrixDefinitions.assessmentHint,
      inheritsPreviousLevel: compMatrixDefinitions.inheritsPreviousLevel,
      numericLevel: compMatrixLevels.numericLevel,
    })
    .from(compMatrixDefinitions)
    .innerJoin(
      compMatrixLevels,
      eq(compMatrixDefinitions.compMatrixLevelId, compMatrixLevels.id),
    )
    .where(eq(compMatrixLevels.compMatrixId, matrixId))
    .orderBy(
      asc(compMatrixDefinitions.compMatrixCompetencyId),
      asc(compMatrixLevels.numericLevel),
    );

  // We overwrite the definitions with the sorted ones
  for (const area of matrix.areas) {
    for (const competency of area.competencies) {
      competency.definitions = sortedDefinitions.filter(
        (d) => d.compMatrixCompetencyId === competency.id,
      );
    }
  }

  return matrix;
}
