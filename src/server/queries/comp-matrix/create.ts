import { db } from "~/server/db";
import { compMatrices } from "~/server/db/schema";
import type { NewCompMatrix } from "./index";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import type { CreateCompMatrixPayload } from "~/zod-schemas/comp-matrix";

export async function createCompMatrix(
  input: CreateCompMatrixPayload,
): Promise<NewCompMatrix> {
  const organizationId = getCurrentUserOrgId();

  console.log("input", { input, organizationId });

  const [matrix] = await db
    .insert(compMatrices)
    .values({
      ...input,
      organizationId,
    })
    .returning();

  if (!matrix) {
    throw new Error("Failed to create competency matrix");
  }

  return matrix;
}
