import { NextRequest } from "next/server";
import { getReferenceRatings } from "~/server/queries/comp-matrix-current-rating/get-reference-ratings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matrixIdRaw = searchParams.get("matrixId");
  const competencyIdRaw = searchParams.get("competencyId");

  const matrixId = matrixIdRaw ? Number(matrixIdRaw) : NaN;
  const competencyId = competencyIdRaw ? Number(competencyIdRaw) : NaN;

  if (isNaN(matrixId) || isNaN(competencyId)) {
    return new Response(
      JSON.stringify({ error: "Invalid matrixId or competencyId" }),
      {
        status: 400,
      },
    );
  }

  const ratings = await getReferenceRatings(matrixId, competencyId);

  return new Response(JSON.stringify(ratings), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
