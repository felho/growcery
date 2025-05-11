import { db } from "~/server/db";
import type { CompMatrixWithFullRelations } from "./index";

export async function getCompMatrixById(
  matrixId: number,
): Promise<CompMatrixWithFullRelations | undefined> {
  return db.query.compMatrices.findFirst({
    where: (m, { eq }) => eq(m.id, matrixId),
    with: {
      areas: {
        orderBy: (areas, { asc }) => [asc(areas.sortOrder)],
        with: {
          competencies: {
            with: {
              definitions: true,
            },
          },
        },
      },
      levels: {
        orderBy: (levels, { asc }) => [asc(levels.numericLevel)],
      },
    },
  });
}
