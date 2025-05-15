import { db } from "~/server/db";
import {
  compMatrixCompetencies,
  compMatrixDefinitions,
} from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import type { CompMatrixCompetencyWithDefinitions } from ".";

export async function reorderCompMatrixCompetencies(input: {
  areaId: number;
  competencies: { id: number; sortOrder: number }[];
}): Promise<CompMatrixCompetencyWithDefinitions[]> {
  for (const comp of input.competencies) {
    await db
      .update(compMatrixCompetencies)
      .set({ sortOrder: comp.sortOrder })
      .where(eq(compMatrixCompetencies.id, comp.id));
  }

  return db.query.compMatrixCompetencies.findMany({
    where: (m, { eq }) => eq(m.compMatrixAreaId, input.areaId),
    orderBy: (competencies, { asc }) => [asc(competencies.sortOrder)],
    with: {
      definitions: true,
    },
  });
}
