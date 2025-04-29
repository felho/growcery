"use client";

import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/app/_components/form/input-with-label";
import { insertUserSchema } from "~/zod-schemas/user";
import type { InsertUserInput } from "~/zod-schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createUserAction } from "~/server/actions/create-user-action";
import { toast } from "sonner";
import { LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserForm() {
  const router = useRouter();

  const form = useForm<InsertUserInput>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      functionId: undefined,
      managerId: undefined,
      orgUnitId: undefined,
    },
    mode: "onBlur",
  });

  const {
    execute: createUser,
    result: createResult,
    isPending,
  } = useAction(createUserAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(data.message);
        router.push("/admin/users");
      }
    },
    onError() {
      toast.error("Something went wrong while creating the user.");
    },
  });

  async function onSubmit(values: InsertUserInput) {
    createUser(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputWithLabel<InsertUserInput>
            fieldTitle="Full Name"
            nameInSchema="fullName"
            placeholder="Enter full name"
          />

          <InputWithLabel<InsertUserInput>
            fieldTitle="Email"
            nameInSchema="email"
            placeholder="Enter email address"
            type="email"
          />

          <InputWithLabel<InsertUserInput>
            fieldTitle="Function ID"
            nameInSchema="functionId"
            type="number"
            placeholder="Enter function ID"
          />

          <InputWithLabel<InsertUserInput>
            fieldTitle="Manager ID"
            nameInSchema="managerId"
            type="number"
            placeholder="Enter manager ID"
          />

          <InputWithLabel<InsertUserInput>
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
                  Saving...
                </>
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
