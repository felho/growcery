import { notFound } from "next/navigation";
import { getUserArchetypeById } from "~/server/queries/user-archetype";
import { UserArchetypeForm } from "./user-archetype-form";
import { type Metadata } from "next";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { archetypeId?: string };
}): Promise<Metadata> {
  const { archetypeId } = await searchParams;
  return {
    title: archetypeId ? `Edit Archetype #${archetypeId}` : "Create Archetype",
  };
}

interface PageProps {
  searchParams: {
    archetypeId?: string;
  };
}

export default async function UserArchetypeFormPage({
  searchParams,
}: PageProps) {
  const { archetypeId } = await searchParams;
  const mode: "create" | "edit" = archetypeId ? "edit" : "create";

  let archetype = undefined;

  if (archetypeId) {
    const found = await getUserArchetypeById(Number(archetypeId));
    if (!found) notFound();
    archetype = {
      ...found,
      description: found.description ?? "",
    };
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit Archetype" : "Create Archetype"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Modify the details of the archetype"
            : "Fill out the details to add a new archetype"}
        </p>
      </div>

      <UserArchetypeForm
        mode={mode}
        archetype={mode === "edit" ? archetype : undefined}
        key={mode === "edit" ? `edit-${archetypeId}` : "create"}
      />
    </div>
  );
}
