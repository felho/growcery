import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { compMatrixLevelAssessments } from "~/server/db/schema/tables/comp-matrix-level-assessments";
import { eq, inArray } from "drizzle-orm";

// Define schema to validate incoming request body
const bodySchema = z.object({
  userCompMatrixAssignmentIds: z.array(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { userCompMatrixAssignmentIds } = parsed.data;

    const results = await db
      .select()
      .from(compMatrixLevelAssessments)
      .where(
        inArray(
          compMatrixLevelAssessments.userCompMatrixAssignmentId,
          userCompMatrixAssignmentIds,
        ),
      );

    // Group results by userCompMatrixAssignmentId
    const grouped = results.reduce<Record<number, typeof results>>(
      (acc, curr) => {
        const key = curr.userCompMatrixAssignmentId;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
      },
      {},
    );

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching level assessments by assignment IDs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
