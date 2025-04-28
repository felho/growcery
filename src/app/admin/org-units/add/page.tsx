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
import { toast } from "sonner";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  level: z.string().min(1, "Level is required"),
});

export default function CreateOrgUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parentId = searchParams.get("parentId");
  const parentName = searchParams.get("parentName");
  const parentLevel = searchParams.get("parentLevel");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      level: parentLevel ? String(Number(parentLevel) + 1) : "1",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter unit level"
                      {...field}
                      disabled={!!parentName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
