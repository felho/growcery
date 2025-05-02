import { getAllUsersForOrg } from "~/server/queries";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const organizationId = await getCurrentUserOrgId();
    const users = await getAllUsersForOrg(organizationId);

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
