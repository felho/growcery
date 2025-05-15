import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { compMatrixCompetencies } from "~/server/db/schema";
import type { NewCompMatrixCompetency } from "./index";
import type { CompMatrixCompetency } from "./index";
export async function createCompMatrixCompetency(
  input: NewCompMatrixCompetency,
): Promise<CompMatrixCompetency> {
  const { compMatrixAreaId, title, calculationWeight } = input;

  const [{ max } = { max: 0 }] = await db
    .select({ max: sql<number>`max(${compMatrixCompetencies.sortOrder})` })
    .from(compMatrixCompetencies)
    .where(eq(compMatrixCompetencies.compMatrixAreaId, compMatrixAreaId));

  const nextSortOrder = (max ?? 0) + 1;

  const [competency] = await db
    .insert(compMatrixCompetencies)
    .values({
      compMatrixAreaId,
      title,
      calculationWeight,
      sortOrder: nextSortOrder,
    })
    .returning();

  if (!competency) {
    throw new Error("Failed to create competency");
  }

  return competency;
}
