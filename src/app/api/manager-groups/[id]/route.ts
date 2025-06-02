import { NextRequest, NextResponse } from "next/server";
import { getManagerGroupById } from "~/server/queries/manager-group";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return new NextResponse("Invalid manager group ID", { status: 400 });
    }

    // Get the manager group by ID
    const managerGroup = await getManagerGroupById(id);

    if (!managerGroup) {
      return new NextResponse("Manager group not found", { status: 404 });
    }

    // Verify the manager group belongs to the user's organization
    const userOrgId = await getCurrentUserOrgId();
    if (managerGroup.organizationId !== userOrgId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(managerGroup);
  } catch (error) {
    console.error("Error fetching manager group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
