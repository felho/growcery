import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { compMatrices } from "~/server/db/schema/tables/comp-matrices";

export type CompMatrixForAssignment = {
  id: number;
  title: string;
  functionId: number;
};

export async function getAllPublishedCompMatrices(): Promise<CompMatrixForAssignment[]> {
  return db
    .select({
      id: compMatrices.id,
      title: compMatrices.title,
      functionId: compMatrices.functionId,
    })
    .from(compMatrices)
    .where(eq(compMatrices.isPublished, true));
}
