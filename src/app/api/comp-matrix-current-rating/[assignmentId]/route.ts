import { NextRequest } from "next/server";
import { getCurrentRatingsByAssignment } from "~/server/queries/comp-matrix-current-rating/get-all-by-assignment-id";

export async function GET(
  req: NextRequest,
  context: { params: { assignmentId: string } },
) {
  const params = await context.params; // ⬅️ Ezt vártuk meg
  const assignmentId = Number(params.assignmentId);

  if (isNaN(assignmentId)) {
    return new Response(JSON.stringify({ error: "Invalid assignmentId" }), {
      status: 400,
    });
  }

  const ratings = await getCurrentRatingsByAssignment(assignmentId);
  if (!ratings) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(ratings), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
