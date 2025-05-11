import { NextRequest } from "next/server";
import { getCurrentRatingsByAssignment } from "~/server/queries/comp-matrix-current-rating/get-all-by-assignment-id";
import { saveCompMatrixCellRating } from "~/server/queries/comp-matrix-current-rating/save";
import { compMatrixCellSaveSchema } from "~/zod-schemas/comp-matrix-current-rating";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assignmentIdRaw = searchParams.get("assignmentId");
  const assignmentId = assignmentIdRaw ? Number(assignmentIdRaw) : NaN;

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

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = compMatrixCellSaveSchema.safeParse(json);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: result.error }),
        { status: 400 },
      );
    }

    await saveCompMatrixCellRating(result.data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API save error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
