import { NextResponse } from "next/server";
import { getAllUsersWithActiveMatrixAssignmentsForOrg } from "~/server/queries/user/get-all-by-org-with-active-matrix-assignments";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET() {
  try {
    const organizationId = getCurrentUserOrgId();
    const users =
      await getAllUsersWithActiveMatrixAssignmentsForOrg(organizationId);
    return NextResponse.json(users);
  } catch (error) {
    console.error(
      "Error fetching users with active matrix assignments:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch users with active matrix assignments" },
      { status: 500 },
    );
  }
}
