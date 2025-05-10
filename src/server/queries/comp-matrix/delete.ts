import { db } from "~/server/db";
import { compMatrices } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { CompMatrix } from "./index";

export async function deleteCompMatrix(id: number): Promise<CompMatrix> {
  const [deletedMatrix] = await db
    .delete(compMatrices)
    .where(eq(compMatrices.id, id))
    .returning();

  if (!deletedMatrix) {
    throw new Error(`Matrix with ID ${id} not found`);
  }

  return deletedMatrix;
}
