import type { CompMatrix } from "./index";
import { db } from "~/server/db";
import { compMatrices } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function getAllCompMatricesByOrg(
  organizationId: number,
): Promise<CompMatrix[]> {
  return db.query.compMatrices.findMany({
    where: eq(compMatrices.organizationId, organizationId),
    with: {
      function: true,
      organization: true,
    },
  });
}
