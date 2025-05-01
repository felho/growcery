"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
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
import { toast } from "sonner";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  parentId: z.coerce.number().int().optional(),
});

interface OrgUnitFormPageProps {
  organizationId: number;
}

const allOrgUnits = [
  { id: 1, name: "HR" },
  { id: 2, name: "Engineering" },
  { id: 3, name: "Sales" },
];

export default function OrgUnitFormPage({
  organizationId,
}: OrgUnitFormPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parentId = searchParams.get("parentId");
  const parentName = searchParams.get("parentName");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: parentId ? Number(parentId) : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Organization ID:", organizationId);
    console.log("Submitted values:", values);

    toast.success(
      parentName
        ? `Added new sub-unit under ${parentName}`
        : "New root organizational unit has been created",
    );
    router.push("/admin/org-units");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {parentName ? `Add Sub-unit to ${parentName}` : "Create Root Unit"}
        </h1>
        <p className="text-muted-foreground">
          {parentName
            ? "Add a new organizational unit under the selected parent unit"
            : "Add a new root organizational unit"}
        </p>
        <p className="text-muted-foreground text-sm">
          (Org ID: <code>{organizationId}</code>)
        </p>
      </div>

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
              z.infer<typeof formSchema>,
              { id: number; description: string }
            >
              fieldTitle="Parent Unit (optional)"
              nameInSchema="parentId"
              placeholder="None"
              data={allOrgUnits.map((u) => ({
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
              <Button type="submit" className="cursor-pointer">
                {parentName ? "Add Sub-unit" : "Create Root Unit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin/org-units")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
