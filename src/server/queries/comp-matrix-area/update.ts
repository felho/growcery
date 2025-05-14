import { db } from "~/server/db";
import { compMatrixAreas } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrixAreaWithFullRelations } from ".";

export async function updateCompMatrixArea(input: {
  id: number;
  title: string;
  shortDescription?: string;
}): Promise<CompMatrixAreaWithFullRelations> {
  const [updated] = await db
    .update(compMatrixAreas)
    .set({
      title: input.title,
      shortDescription: input.shortDescription,
    })
    .where(eq(compMatrixAreas.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Area not found");
  }

  return {
    ...updated,
    competencies: [],
  };
}
