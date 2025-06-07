import { db } from "~/server/db";
import { compMatrices } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { UpdateCompMatrixPayload } from "~/zod-schemas/comp-matrix";
import type { CompMatrix } from "./index";

export async function updateCompMatrix(
  matrixId: number,
  input: UpdateCompMatrixPayload,
): Promise<CompMatrix> {
  const [matrix] = await db
    .update(compMatrices)
    .set({
      title: input.title,
      functionId: input.functionId,
      isPublished: input.isPublished,
      levelCode: input.levelCode,
      updatedAt: new Date(),
    })
    .where(eq(compMatrices.id, matrixId))
    .returning();

  if (!matrix) {
    throw new Error("Failed to update competency matrix");
  }

  return matrix;
}
