import { db } from "~/server/db";
import { compMatrixAreas } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type {
  ReorderAreaInput,
  CompMatrixAreaWithFullRelations,
} from "./index";

export async function reorderCompMatrixAreas(
  matrixId: number,
  areas: ReorderAreaInput[],
): Promise<CompMatrixAreaWithFullRelations[]> {
  for (const area of areas) {
    await db
      .update(compMatrixAreas)
      .set({ sortOrder: area.sortOrder })
      .where(eq(compMatrixAreas.id, area.id));
  }

  return db.query.compMatrixAreas.findMany({
    where: eq(compMatrixAreas.compMatrixId, matrixId),
    with: {
      competencies: {
        with: {
          definitions: true,
        },
      },
    },
    orderBy: (area) => area.sortOrder,
  });
}
