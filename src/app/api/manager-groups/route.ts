import { NextResponse } from "next/server";
import { getAllManagerGroupsForOrg } from "~/server/queries/manager-group/get-all-by-org";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET() {
  try {
    const organizationId = await getCurrentUserOrgId();
    const managerGroups = await getAllManagerGroupsForOrg(organizationId);

    return NextResponse.json(managerGroups);
  } catch (error) {
    console.error("Error fetching manager groups:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
