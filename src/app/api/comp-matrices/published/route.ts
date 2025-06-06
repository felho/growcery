import { NextResponse } from "next/server";
import { getAllPublishedCompMatrices } from "~/server/queries/comp-matrix/get-published";

export async function GET() {
  try {
    const matrices = await getAllPublishedCompMatrices();
    return NextResponse.json(matrices);
  } catch (error) {
    console.error("Error fetching published matrices:", error);
    return NextResponse.json(
      { error: "Failed to fetch matrices" },
      { status: 500 }
    );
  }
}
