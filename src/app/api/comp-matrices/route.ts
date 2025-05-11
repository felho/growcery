import { NextResponse } from "next/server";
import { getAllCompMatricesByOrg } from "~/server/queries/comp-matrix/get-all-by-org";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import { createCompMatrix } from "~/server/queries/comp-matrix/create";
import { createCompMatrixSchema } from "~/zod-schemas/comp-matrix";

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

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = createCompMatrixSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error },
        { status: 400 },
      );
    }

    const matrix = await createCompMatrix(result.data);
    return NextResponse.json(matrix);
  } catch (error) {
    console.error("Error creating comp matrix:", error);
    return NextResponse.json(
      { error: "Failed to create comp matrix" },
      { status: 500 },
    );
  }
}
