import { NextRequest } from "next/server";
import { getActiveUserCompMatrixAssignmentByUserId } from "~/server/queries/user_comp_matrix_assignment";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } },
) {
  const params = await context.params;
  const userId = parseInt(params.userId);
  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), {
      status: 400,
    });
  }

  const assignment = await getActiveUserCompMatrixAssignmentByUserId(userId);
  if (!assignment) {
    return new Response(JSON.stringify({ error: "Assignment not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(assignment), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
