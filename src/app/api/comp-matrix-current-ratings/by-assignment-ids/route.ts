import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentRatingsByAssignmentIds } from "~/server/queries/comp-matrix-current-rating/get-by-assignment-ids";

const bodySchema = z.object({
  assignmentIds: z.array(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = bodySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(parseResult.error.format(), { status: 400 });
    }

    const assignmentIds = parseResult.data.assignmentIds;
    console.log("assignmentIds", assignmentIds);

    const data = await getCurrentRatingsByAssignmentIds(assignmentIds);
    console.log("data", data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch ratings for userIds via POST:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
