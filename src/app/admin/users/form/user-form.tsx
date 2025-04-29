"use client";

import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/app/_components/form/input-with-label";
import { insertUserSchemaFromForm } from "~/zod-schemas/user";
import type { InsertUserInputFromForm } from "~/zod-schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createUserAction } from "~/server/actions/create-user-action";
import { updateUserAction } from "~/server/actions/update-user-action";
import { toast } from "sonner";
import { LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserFormProps {
  mode: "create" | "edit";
  user?: InsertUserInputFromForm & { id: number };
}

export function UserForm({ mode, user }: UserFormProps) {
  const router = useRouter();

  const form = useForm<InsertUserInputFromForm>({
    resolver: zodResolver(insertUserSchemaFromForm),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      functionId: user?.functionId ?? undefined,
      managerId: user?.managerId ?? undefined,
      orgUnitId: user?.orgUnitId ?? undefined,
    },
    mode: "onBlur",
  });

  const {
    execute: createUser,
    result: createResult,
    isPending: isCreating,
  } = useAction(createUserAction, {
    onSuccess({ data }) {
      toast.success(data?.message || "User created.");
      router.push("/admin/users");
    },
    onError() {
      toast.error("Something went wrong while creating the user.");
    },
  });

  const {
    execute: updateUser,
    result: updateResult,
    isPending: isUpdating,
  } = useAction(updateUserAction, {
    onSuccess({ data }) {
      toast.success(data?.message || "User updated.");
      router.push("/admin/users");
    },
    onError() {
      toast.error("Something went wrong while updating the user.");
    },
  });

  async function onSubmit(values: InsertUserInputFromForm) {
    if (mode === "edit" && user?.id) {
      updateUser({ id: user.id, ...values });
    } else {
      createUser(values);
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputWithLabel<InsertUserInputFromForm>
            fieldTitle="Full Name"
            nameInSchema="fullName"
            placeholder="Enter full name"
          />

          <InputWithLabel<InsertUserInputFromForm>
            fieldTitle="Email"
            nameInSchema="email"
            placeholder="Enter email address"
            type="email"
          />

          <InputWithLabel<InsertUserInputFromForm>
            fieldTitle="Function ID"
            nameInSchema="functionId"
            type="number"
            placeholder="Enter function ID"
          />

          <InputWithLabel<InsertUserInputFromForm>
            fieldTitle="Manager ID"
            nameInSchema="managerId"
            type="number"
            placeholder="Enter manager ID"
          />

          <InputWithLabel<InsertUserInputFromForm>
            fieldTitle="Org Unit ID"
            nameInSchema="orgUnitId"
            type="number"
            placeholder="Enter org unit ID"
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-40 cursor-pointer"
            >
              {isPending ? (
                <>
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : mode === "edit" ? (
                "Update User"
              ) : (
                "Save User"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
              className="w-40 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
