import { NextRequest } from "next/server";
import { deleteCompMatrix } from "~/server/queries/comp-matrix/delete";

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
