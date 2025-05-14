import { db } from "~/server/db";
import { compMatrixRatingOptions } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function deleteCompMatrixRatingOption(id: number): Promise<void> {
  await db
    .delete(compMatrixRatingOptions)
    .where(eq(compMatrixRatingOptions.id, id));
}
