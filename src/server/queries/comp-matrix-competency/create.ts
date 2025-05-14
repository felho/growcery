import { db } from "~/server/db";
import { compMatrixCompetencies } from "~/server/db/schema";
import type { NewCompMatrixCompetency } from "./index";

export async function createCompMatrixCompetency(
  input: NewCompMatrixCompetency,
) {
  const [competency] = await db
    .insert(compMatrixCompetencies)
    .values(input)
    .returning();

  return competency;
}
