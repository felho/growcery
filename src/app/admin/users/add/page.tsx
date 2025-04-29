import type { Metadata } from "next";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";
import { UserForm } from "./user-form";

export const metadata: Metadata = {
  title: "Create User",
};

export default function CreateUserPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create User</h1>
        <p className="text-muted-foreground">
          Add a new user to your organization
        </p>
      </div>

      <UserForm />
    </div>
  );
}
