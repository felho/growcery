import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentRatingsByUserIds } from "~/server/queries/comp-matrix-current-rating/get-by-user-ids";

const bodySchema = z.object({
  userIds: z.array(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = bodySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(parseResult.error.format(), { status: 400 });
    }

    const userIds = parseResult.data.userIds;

    const data = await getCurrentRatingsByUserIds(userIds);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch ratings for userIds via POST:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
