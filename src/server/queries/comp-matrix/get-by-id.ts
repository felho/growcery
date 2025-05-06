import { db } from "~/server/db";
import { compMatrices } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function getCompMatrixById(matrixId: number) {
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
