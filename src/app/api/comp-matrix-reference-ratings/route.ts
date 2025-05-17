import { NextRequest } from "next/server";
import { getReferenceRatings } from "~/server/queries/comp-matrix-current-rating/get-reference-ratings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matrixIdRaw = searchParams.get("matrixId");
  const competencyIdRaw = searchParams.get("competencyId");
  const userIdsRaw = searchParams.get("userIds");

  const matrixId = matrixIdRaw ? Number(matrixIdRaw) : NaN;
  const competencyId = competencyIdRaw ? Number(competencyIdRaw) : NaN;
  const userIds = userIdsRaw
    ? userIdsRaw
        .split(",")
        .map((id) => Number(id))
        .filter((id) => !isNaN(id))
    : undefined;

  if (isNaN(matrixId) || isNaN(competencyId)) {
    return new Response(
      JSON.stringify({ error: "Invalid matrixId or competencyId" }),
      {
        status: 400,
      },
    );
  }

  const ratings = await getReferenceRatings(matrixId, competencyId, userIds);

  return new Response(JSON.stringify(ratings), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
