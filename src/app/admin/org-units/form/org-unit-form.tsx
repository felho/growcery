"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { SelectWithLabel } from "~/app/_components/form/select-with-label";
import { Button } from "~/components/ui/button";
import { LoaderCircle as LoaderIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { InsertOrgUnitInputFromForm } from "~/zod-schemas/org-unit";

interface OrgUnitFormProps {
  form: UseFormReturn<InsertOrgUnitInputFromForm>;
  onSubmit: (values: InsertOrgUnitInputFromForm) => void;
  parentOptions: { id: number; name: string }[];
  isPending: boolean;
  mode: "create" | "edit";
}

export function OrgUnitForm({
  form,
  onSubmit,
  parentOptions,
  isPending,
  mode,
}: OrgUnitFormProps) {
  return (
    <div className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter unit name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SelectWithLabel<
            InsertOrgUnitInputFromForm,
            { id: number; description: string }
          >
            fieldTitle="Parent Unit (optional)"
            nameInSchema="parentId"
            placeholder="None"
            data={parentOptions.map((u) => ({
              id: u.id,
              description: u.name,
            }))}
            getValue={(item) => item.id.toString()}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter unit description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : mode === "edit" ? (
                "Update Unit"
              ) : (
                "Create Unit"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
