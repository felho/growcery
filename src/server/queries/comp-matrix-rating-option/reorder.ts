import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { compMatrixRatingOptions } from "~/server/db/schema";

export async function reorderCompMatrixRatingOptions(params: {
  matrixId: number;
  ratingOptions: { id: number; sortOrder: number }[];
}) {
  const updates = params.ratingOptions.map((opt) =>
    db
      .update(compMatrixRatingOptions)
      .set({ sortOrder: opt.sortOrder })
      .where(eq(compMatrixRatingOptions.id, opt.id)),
  );

  await Promise.all(updates);

  return {
    ratingOptions: await db.query.compMatrixRatingOptions.findMany({
      where: (opt, { eq }) => eq(opt.competencyMatrixId, params.matrixId),
      orderBy: (opt, { asc }) => asc(opt.sortOrder),
    }),
  };
}
