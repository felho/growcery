import { NextRequest } from "next/server";
import { deleteCompMatrix } from "~/server/queries/comp-matrix/delete";
import { getCompMatrixById } from "~/server/queries/comp-matrix/get-by-id";
import { updateCompMatrix } from "~/server/queries/comp-matrix/update";
import { updateCompMatrixSchema } from "~/zod-schemas/comp-matrix";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });
    }

    await deleteCompMatrix(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting comp matrix:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete comp matrix" }),
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });
    }

    const matrix = await getCompMatrixById(id);
    if (!matrix) {
      return new Response(JSON.stringify({ error: "Matrix not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(matrix), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching comp matrix:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch comp matrix" }),
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });
    }

    const body = await req.json();
    const validatedData = updateCompMatrixSchema.parse(body);

    console.log("validatedData", validatedData);

    const updatedMatrix = await updateCompMatrix(id, validatedData);

    return new Response(JSON.stringify(updatedMatrix), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating comp matrix:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update comp matrix" }),
      { status: 500 },
    );
  }
}
