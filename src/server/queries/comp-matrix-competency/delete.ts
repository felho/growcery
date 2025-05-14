import { db } from "~/server/db";
import { compMatrixCompetencies } from "~/server/db/schema/tables/comp-matrix-competencies";
import { compMatrixDefinitions } from "~/server/db/schema/tables/comp-matrix-definitions";
import { eq } from "drizzle-orm";

export async function deleteCompMatrixCompetency(id: number) {
  await db
    .delete(compMatrixDefinitions)
    .where(eq(compMatrixDefinitions.compMatrixCompetencyId, id));

  // Majd a kompetenciát
  const deleted = await db
    .delete(compMatrixCompetencies)
    .where(eq(compMatrixCompetencies.id, id))
    .returning();

  return deleted[0];
}
