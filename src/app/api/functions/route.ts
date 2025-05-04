import { getFunctionsByOrg } from "~/server/queries/functions";
import { NextResponse } from "next/server";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET() {
  const organizationId = getCurrentUserOrgId();
  const functions = await getFunctionsByOrg(organizationId);
  return NextResponse.json(functions);
}
