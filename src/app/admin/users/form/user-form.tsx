"use client";

import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/app/_components/form/input-with-label";
import { insertUserSchemaFromForm } from "~/zod-schemas/user";
import type { InsertUserInputFromForm } from "~/zod-schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createUserAction } from "~/server/actions/user/create";
import { updateUserAction } from "~/server/actions/user/update";
import { toast } from "sonner";
import { LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SelectWithLabel } from "~/app/_components/form/select-with-label";
import { Combobox } from "~/components/ui/combobox";
import { Checkbox } from "~/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl } from "~/components/ui/form";

interface UserFormProps {
  mode: "create" | "edit";
  user?: InsertUserInputFromForm & { id: number };
  functions: { id: number; description: string }[];
  users: { id: number; description: string }[];
  orgUnits: { id: number; name: string; parentId: number | null }[];
  archetypes: { id: number; description: string }[];
}

function buildHierarchicalOptions(
  units: { id: number; name: string; parentId: number | null }[],
  parentId: number | null = null,
  level = 0,
): { id: number; name: string; description: string }[] {
  return units
    .filter((u) => u.parentId === parentId)
    .flatMap((u) => [
      {
        id: u.id,
        name: u.name,
        description: `${level == 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
      },
      ...buildHierarchicalOptions(units, u.id, level + 1),
    ]);
}

export function UserForm({
  mode,
  user,
  functions,
  users,
  orgUnits,
  archetypes,
}: UserFormProps) {
  const router = useRouter();
  const hierarchicalOptions = buildHierarchicalOptions(orgUnits);

  const form = useForm<InsertUserInputFromForm>({
    resolver: zodResolver(insertUserSchemaFromForm) as any,
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      isManager: user?.isManager ?? false,
      functionId: user?.functionId ?? undefined,
      managerId: user?.managerId ?? undefined,
      orgUnitId: user?.orgUnitId ?? undefined,
      archetypeId: user?.archetypeId ?? undefined,
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
            autoFocus
          />

          <InputWithLabel<InsertUserInputFromForm>
            fieldTitle="Email"
            nameInSchema="email"
            placeholder="Enter email address"
            type="email"
          />
          
          <FormField
            control={form.control}
            name="isManager"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Manager Role</FormLabel>
                  <p className="text-muted-foreground text-sm">User has manager privileges</p>
                </div>
              </FormItem>
            )}
          />

          <SelectWithLabel<
            InsertUserInputFromForm,
            { id: number; name: string; description: string }
          >
            fieldTitle="Function"
            nameInSchema="functionId"
            data={[
              { id: 0, name: "No function", description: "No function" },
              ...functions.map((f) => ({
                id: f.id,
                name: f.description,
                description: f.description,
              })),
            ]}
            placeholder="Select function"
            getValue={(item) => item.id.toString()}
            getLabel={(item) => item.description}
            renderItem={(item) => (
              <div
                className={item.id === 0 ? "text-muted-foreground italic" : ""}
              >
                {item.description}
              </div>
            )}
          />

          <div className="max-w-xs space-y-2">
            <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Manager
            </label>
            <Combobox
              id="manager-select"
              items={[
                { label: "No manager", value: "0" },
                ...users
                  .filter((u) => u.id !== user?.id)
                  .map((user) => ({
                    label: user.description,
                    value: user.id.toString(),
                  })),
              ]}
              placeholder="Select manager"
              value={form.watch("managerId")?.toString()}
              onChange={(value) => form.setValue("managerId", parseInt(value))}
            />
            {form.formState.errors.managerId && (
              <p className="text-destructive text-sm font-medium">
                {form.formState.errors.managerId.message}
              </p>
            )}
          </div>

          <SelectWithLabel<
            InsertUserInputFromForm,
            { id: number; name: string; description: string }
          >
            fieldTitle="Organization Unit"
            nameInSchema="orgUnitId"
            data={[
              {
                id: 0,
                name: "No organization unit",
                description: "No organization unit",
              },
              ...hierarchicalOptions,
            ]}
            placeholder="Select organization unit"
            getValue={(item) => item.id.toString()}
            getLabel={(item) => item.description}
            renderItem={(item) => (
              <div
                className={item.id === 0 ? "text-muted-foreground italic" : ""}
              >
                {item.description}
              </div>
            )}
          />

          <SelectWithLabel<
            InsertUserInputFromForm,
            { id: number; name: string; description: string }
          >
            fieldTitle="Archetype"
            nameInSchema="archetypeId"
            data={[
              { id: 0, name: "No archetype", description: "No archetype" },
              ...archetypes.map((a) => ({
                id: a.id,
                name: a.description,
                description: a.description,
              })),
            ]}
            placeholder="Select archetype"
            getValue={(item) => item.id.toString()}
            getLabel={(item) => item.description}
            renderItem={(item) => (
              <div
                className={item.id === 0 ? "text-muted-foreground italic" : ""}
              >
                {item.description}
              </div>
            )}
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
