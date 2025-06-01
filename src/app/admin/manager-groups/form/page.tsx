import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Users, Filter } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "~/app/admin/_components/breadcrumbs";
import { users, orgUnits, getOrgUnitName } from "~/data/mockData";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  members: z.array(z.string()).min(1, "At least one member must be selected"),
});

type FormData = z.infer<typeof formSchema>;

const CreateManagerGroup = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgUnitFilter, setOrgUnitFilter] = useState<string>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast(`Manager group "${data.name}" has been created successfully.`);

      router.push("/admin/manager-groups");
    } catch (error) {
      toast.error("Failed to create manager group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMembers = form.watch("members");

  // Filter users based on selected criteria, but always include already selected users
  const filteredUsers = users.filter((user) => {
    const isSelected = selectedMembers.includes(user.id);

    // Always show selected users
    if (isSelected) return true;

    // Apply filters for non-selected users
    const matchesOrgUnit =
      orgUnitFilter === "all" || user.orgUnit === orgUnitFilter;
    const matchesUserType =
      userTypeFilter === "all" ||
      (userTypeFilter === "Manager" &&
        (user.role === "Manager" || user.role === "Admin")) ||
      (userTypeFilter === "User" && user.role === "User");

    return matchesOrgUnit && matchesUserType;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/manager-groups")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Manager Group</h1>
          <p className="text-muted-foreground mt-1">
            Add a new manager group to organize your team leaders
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Engineering Leadership"
                          {...field}
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
                        <Textarea
                          placeholder="Describe the purpose and scope of this manager group..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Members Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Members
                  {selectedMembers.length > 0 && (
                    <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-sm">
                      {selectedMembers.length} selected
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {/* Members List - Left Side */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="members"
                      render={() => (
                        <FormItem>
                          <div className="max-h-[400px] space-y-3 overflow-y-auto rounded-md border p-3">
                            {filteredUsers.map((user) => (
                              <FormField
                                key={user.id}
                                control={form.control}
                                name="members"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(user.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                user.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== user.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1 space-y-0">
                                      <div className="text-sm font-medium">
                                        {user.name}
                                      </div>
                                      <div className="text-muted-foreground text-xs">
                                        {user.email}
                                      </div>
                                      <div className="text-muted-foreground text-xs">
                                        {user.role} •{" "}
                                        {getOrgUnitName(user.orgUnit)}
                                      </div>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                            {filteredUsers.length === 0 && (
                              <div className="text-muted-foreground py-4 text-center">
                                No users match the selected filters
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Filters - Right Side */}
                  <div className="w-64 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Filter className="text-muted-foreground h-4 w-4" />
                        <label className="text-sm font-medium">Org Unit</label>
                      </div>
                      <Select
                        value={orgUnitFilter}
                        onValueChange={setOrgUnitFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All units" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Units</SelectItem>
                          {orgUnits.map((orgUnit) => (
                            <SelectItem key={orgUnit.id} value={orgUnit.id}>
                              {orgUnit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Filter className="text-muted-foreground h-4 w-4" />
                        <label className="text-sm font-medium">User Type</label>
                      </div>
                      <Select
                        value={userTypeFilter}
                        onValueChange={setUserTypeFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/manager-groups")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Manager Group"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateManagerGroup;
