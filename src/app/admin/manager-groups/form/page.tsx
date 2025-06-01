import { notFound } from "next/navigation";
import { type Metadata } from "next";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";
import { ManagerGroupForm } from "./manager-group-form";
import { getManagerGroupById } from "~/server/queries/manager-group";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { id?: string };
}): Promise<Metadata> {
  const { id } = searchParams;
  return {
    title: id ? `Edit Manager Group #${id}` : "Create Manager Group",
  };
}

interface PageProps {
  searchParams: {
    id?: string;
  };
}

export default async function ManagerGroupFormPage({ searchParams }: PageProps) {
  const { id } = searchParams;
  const mode: "create" | "edit" = id ? "edit" : "create";

  let managerGroup = undefined;

  if (id) {
    const found = await getManagerGroupById(Number(id));
    if (!found) notFound();
    
    // Transform the data to match what the form expects
    managerGroup = {
      id: found.id,
      name: found.name,
      description: found.description || "",
      members: found.members.map(member => member.id.toString()),
    };
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit Manager Group" : "Create Manager Group"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Modify the details of the manager group"
            : "Fill out the details to add a new manager group"}
        </p>
      </div>

      <ManagerGroupForm
        mode={mode}
        managerGroup={mode === "edit" ? managerGroup : undefined}
        key={mode === "edit" ? `edit-${id}` : "create"}
      />
    </div>
  );
}
