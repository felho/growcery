import { db } from "~/server/db";
import { compMatrices } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixWithFullRelations } from "./index";

export async function getCompMatrixById(
  matrixId: number,
): Promise<CompMatrixWithFullRelations | undefined> {
  return db.query.compMatrices.findFirst({
    where: (m, { eq }) => eq(m.id, matrixId),
    with: {
      areas: {
        with: {
          competencies: {
            with: {
              definitions: true,
            },
          },
        },
      },
      levels: true,
    },
  });
}
