import { db } from "~/server/db";
import { compMatrixCompetencies } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function updateCompMatrixCompetency(input: {
  id: number;
  title: string;
}) {
  const [updated] = await db
    .update(compMatrixCompetencies)
    .set({ title: input.title })
    .where(eq(compMatrixCompetencies.id, input.id))
    .returning();

  return updated;
}
