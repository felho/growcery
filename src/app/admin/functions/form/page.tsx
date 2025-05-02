import { notFound } from "next/navigation";
import { getFunctionById } from "~/server/queries";
import { FunctionForm } from "./function-form";
import { type Metadata } from "next";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { functionId?: string };
}): Promise<Metadata> {
  const { functionId } = searchParams;
  return {
    title: functionId ? `Edit Function #${functionId}` : "Create Function",
  };
}

interface PageProps {
  searchParams: {
    functionId?: string;
  };
}

export default async function FunctionFormPage({ searchParams }: PageProps) {
  const functionId = searchParams.functionId;
  const mode: "create" | "edit" = functionId ? "edit" : "create";

  let func = undefined;

  if (functionId) {
    const found = await getFunctionById(Number(functionId));
    if (!found) notFound();

    func = {
      ...found,
      description: found.description ?? "",
    };
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit Function" : "Create Function"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Modify the details of the function"
            : "Fill out the details to add a new function"}
        </p>
      </div>

      <FunctionForm
        mode={mode}
        func={mode === "edit" ? func : undefined}
        key={mode === "edit" ? `edit-${functionId}` : "create"}
      />
    </div>
  );
}
