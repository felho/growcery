import { NextResponse } from "next/server";
import { getAllUsersWithActiveMatrixName } from "~/server/queries/user/get-all-with-active-matrix-name";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET() {
  try {
    const organizationId = getCurrentUserOrgId();
    const users = await getAllUsersWithActiveMatrixName(organizationId);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users with matrix names:", error);
    return NextResponse.json(
      { error: "Failed to fetch users with matrix names" },
      { status: 500 },
    );
  }
}
