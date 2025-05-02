import { notFound } from "next/navigation";
import { getUserById } from "~/server/queries";
import { UserForm } from "./user-form";
import { type Metadata } from "next";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { userId?: string };
}): Promise<Metadata> {
  const { userId } = await searchParams;
  return {
    title: userId ? `Edit User #${userId}` : "Create User",
  };
}

interface PageProps {
  searchParams: {
    userId?: string;
  };
}

export default async function UserFormPage({ searchParams }: PageProps) {
  const { userId } = await searchParams;
  const mode: "create" | "edit" = userId ? "edit" : "create";

  let user = undefined;

  if (userId) {
    const found = await getUserById(Number(userId));
    if (!found) notFound();

    user = {
      ...found,
      functionId: found.functionId ?? undefined,
      managerId: found.managerId ?? undefined,
      orgUnitId: found.orgUnitId ?? undefined,
    };
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit User" : "Create User"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Modify the details of the user"
            : "Fill out the details to add a new user"}
        </p>
      </div>

      <UserForm
        mode={mode}
        user={mode === "edit" ? user : undefined}
        key={mode === "edit" ? `edit-${userId}` : "create"}
      />
    </div>
  );
}
