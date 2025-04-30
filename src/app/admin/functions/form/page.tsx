import { notFound } from "next/navigation";
import { getFunctionById } from "~/server/queries";
import { FunctionForm } from "./function-form";
import { type Metadata } from "next";

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

  if (functionId) {
    const func = await getFunctionById(Number(functionId));
    if (!func) notFound();

    const normalizedFunc = {
      ...func,
      description: func.description ?? "", // null → ""
    };

    return (
      <FunctionForm mode="edit" func={normalizedFunc} key={`edit-${func.id}`} />
    );
  }

  return <FunctionForm mode="create" key="create" />;
}
