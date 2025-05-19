import { NextResponse } from "next/server";
import { getLevelAssessments } from "~/server/queries/comp-matrix-level-assessments/get";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userCompMatrixAssignmentId = searchParams.get(
      "userCompMatrixAssignmentId",
    );

    if (!userCompMatrixAssignmentId) {
      return NextResponse.json(
        { error: "userCompMatrixAssignmentId is required" },
        { status: 400 },
      );
    }

    const assessments = await getLevelAssessments(
      parseInt(userCompMatrixAssignmentId),
    );
    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching level assessments:", error);
    return NextResponse.json(
      { error: "Failed to fetch level assessments" },
      { status: 500 },
    );
  }
}
