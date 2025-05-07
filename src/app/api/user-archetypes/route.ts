import { NextResponse } from "next/server";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import { getAllUserArchetypesForOrg } from "~/server/queries/user-archetype";

export async function GET() {
  try {
    const organizationId = getCurrentUserOrgId();
    if (!organizationId) {
      return NextResponse.json(
        { error: "No organization ID" },
        { status: 401 },
      );
    }
    const archetypes = await getAllUserArchetypesForOrg(organizationId);
    return NextResponse.json(archetypes);
  } catch (error) {
    console.error("Error fetching user archetypes:", error);
    return NextResponse.json(
      { error: "Failed to fetch user archetypes" },
      { status: 500 },
    );
  }
}
