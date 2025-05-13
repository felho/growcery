// src/server/queries/comp-matrix-area/create.ts
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { compMatrixAreas } from "~/server/db/schema";
import type { CreateCompMatrixAreaInput } from "~/zod-schemas/comp-matrix-area";
import type { CompMatrixAreaWithFullRelations } from "../comp-matrix-area"; // típus

export async function createCompMatrixArea(
  input: CreateCompMatrixAreaInput,
): Promise<CompMatrixAreaWithFullRelations> {
  const { compMatrixId, title, shortDescription } = input;

  const [{ max } = { max: 0 }] = await db
    .select({ max: sql<number>`max(${compMatrixAreas.sortOrder})` })
    .from(compMatrixAreas)
    .where(eq(compMatrixAreas.compMatrixId, compMatrixId));
  const nextSortOrder = (max ?? 0) + 1;

  const inserted = await db
    .insert(compMatrixAreas)
    .values({
      compMatrixId,
      title,
      shortDescription: shortDescription ?? "",
      sortOrder: nextSortOrder,
    })
    .returning();

  const newArea = inserted[0];
  if (!newArea) {
    throw new Error("Failed to create new area");
  }

  return {
    id: newArea.id,
    title: newArea.title,
    shortDescription: newArea.shortDescription ?? "",
    compMatrixId: newArea.compMatrixId,
    sortOrder: newArea.sortOrder,
    competencies: [],
  };
}
