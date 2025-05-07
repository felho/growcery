import { NextRequest } from "next/server";
import { getCompMatrixById } from "~/server/queries/comp-matrix/get-by-id";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const params = await context.params; // ⬅️ Ezt vártuk meg
  const id = Number(params.id);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  const matrix = await getCompMatrixById(id);
  if (!matrix) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(matrix), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
