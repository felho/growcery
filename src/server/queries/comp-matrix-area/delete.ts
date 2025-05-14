import { db } from "~/server/db";
import {
  compMatrixAreas,
  compMatrixCompetencies,
  compMatrixDefinitions,
} from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function deleteCompMatrixArea(areaId: number) {
  const competencies = await db
    .select({ id: compMatrixCompetencies.id })
    .from(compMatrixCompetencies)
    .where(eq(compMatrixCompetencies.compMatrixAreaId, areaId));

  const competencyIds = competencies.map((c) => c.id);

  if (competencyIds.length > 0) {
    await db
      .delete(compMatrixDefinitions)
      .where(
        inArray(compMatrixDefinitions.compMatrixCompetencyId, competencyIds),
      );

    await db
      .delete(compMatrixCompetencies)
      .where(inArray(compMatrixCompetencies.id, competencyIds));
  }

  await db.delete(compMatrixAreas).where(eq(compMatrixAreas.id, areaId));
}
