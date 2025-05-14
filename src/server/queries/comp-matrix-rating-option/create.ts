import { db } from "~/server/db";
import { compMatrixRatingOptions } from "~/server/db/schema";
import type {
  NewCompMatrixRatingOption,
  CompMatrixRatingOption,
} from "./index";

export async function createCompMatrixRatingOption(
  input: NewCompMatrixRatingOption,
): Promise<CompMatrixRatingOption> {
  const [created] = await db
    .insert(compMatrixRatingOptions)
    .values(input)
    .returning();

  if (!created) {
    throw new Error("Failed to create rating option");
  }

  return created;
}
