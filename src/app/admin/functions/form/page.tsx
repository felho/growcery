"use client";

import { useRouter, useParams } from "next/navigation";
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
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
});

export default function FunctionFormPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const isEditMode = id !== "new";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      // Itt töltenéd be az adatot az ID alapján, pl. API hívással
      form.reset({
        name: "Loaded Function Name",
        description: "Loaded description of the function",
        type: "Loaded type",
      });
    }
  }, [isEditMode, id, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditMode) {
      toast.success(`Function "${values.name}" updated successfully`);
    } else {
      toast.success(`Function "${values.name}" created successfully`);
    }
    router.push("/admin/functions");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Function" : "Create Function"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the function details"
            : "Add a new function to your organization"}
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
                  <FormLabel>Function Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter function name" {...field} />
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
                    <Textarea
                      placeholder="Enter function description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" className="cursor-pointer">
                {isEditMode ? "Save Changes" : "Create Function"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin/functions")}
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
