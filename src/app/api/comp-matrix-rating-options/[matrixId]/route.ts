import { NextRequest } from "next/server";
import { getRatingOptionsByMatrixId } from "~/server/queries/comp-matrix-rating-option/get-by-matrix-id";

export async function GET(
  req: NextRequest,
  context: { params: { matrixId: string } },
) {
  const params = await context.params;
  const matrixId = Number(params.matrixId);

  if (isNaN(matrixId)) {
    return new Response(JSON.stringify({ error: "Invalid matrixId" }), {
      status: 400,
    });
  }

  const ratingOptions = await getRatingOptionsByMatrixId(matrixId);
  if (!ratingOptions) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(ratingOptions), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
