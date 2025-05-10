import { NextResponse } from "next/server";
import { getAllCompMatricesByOrg } from "~/server/queries/comp-matrix/get-all-by-org";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET() {
  try {
    const organizationId = getCurrentUserOrgId();
    const matrices = await getAllCompMatricesByOrg(organizationId);
    return NextResponse.json(matrices);
  } catch (error) {
    console.error("Error fetching comp matrices:", error);
    return NextResponse.json(
      { error: "Failed to fetch comp matrices" },
      { status: 500 },
    );
  }
}
