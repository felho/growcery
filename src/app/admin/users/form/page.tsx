import { notFound } from "next/navigation";
import { getUserById } from "~/server/queries";
import { UserForm } from "./user-form";
import { type Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { userId?: string };
}): Promise<Metadata> {
  const { userId } = searchParams;
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
  const userId = searchParams.userId;

  if (userId) {
    const user = await getUserById(Number(userId));
    if (!user) notFound();

    const normalizedUser = {
      ...user,
      functionId: user.functionId ?? undefined,
      managerId: user.managerId ?? undefined,
      orgUnitId: user.orgUnitId ?? undefined,
    };

    return (
      <UserForm mode="edit" user={normalizedUser} key={`edit-${userId}`} />
    );
  }

  return <UserForm mode="create" key="create" />;
}
