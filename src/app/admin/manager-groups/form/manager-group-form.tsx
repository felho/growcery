"use client";

import { useState } from "react";
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
import { Users, Filter, LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { fetchUsers, fetchOrgUnits } from "~/lib/client-api";
import type { UserWithArchetype } from "~/server/queries/user";
import type { OrgUnit } from "~/server/queries/org-unit";
import { useAction } from "next-safe-action/hooks";
import {
  createManagerGroupAction,
  updateManagerGroupAction,
} from "~/server/actions/manager-group";
import {
  insertManagerGroupSchemaFromForm,
  type InsertManagerGroupInputFromForm,
} from "~/zod-schemas/manager-group";

// Helper function to get org unit name
function getOrgUnitName(orgUnitId: number | null, orgUnits: OrgUnit[]) {
  if (!orgUnitId) return "Not assigned";
  const orgUnit = orgUnits.find((ou) => ou.id === orgUnitId);
  return orgUnit ? orgUnit.name : "Unknown";
}

// Build hierarchical options for org units
function buildHierarchicalOptions(
  units: OrgUnit[],
  parentId: number | null = null,
  level = 0,
): { id: number; name: string; description: string }[] {
  return units
    .filter((u) => u.parentId === parentId)
    .flatMap((u) => [
      {
        id: u.id,
        name: u.name,
        description: `${level === 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
      },
      ...buildHierarchicalOptions(units, u.id, level + 1),
    ]);
}

// Get hierarchical org unit options
function getHierarchicalOrgUnitOptions(orgUnits: OrgUnit[]) {
  return buildHierarchicalOptions(orgUnits);
}

// Recursively get all child org units
function getAllChildOrgUnits(orgUnits: OrgUnit[], parentId: number): number[] {
  const directChildren = orgUnits
    .filter((unit) => unit.parentId === parentId)
    .map((unit) => unit.id);

  const childrenOfChildren = directChildren.flatMap((childId) =>
    getAllChildOrgUnits(orgUnits, childId),
  );

  return [...directChildren, ...childrenOfChildren];
}

interface ManagerGroupFormProps {
  mode: "create" | "edit";
  managerGroup?: {
    id: number;
    name: string;
    description: string;
    members: string[];
  };
}

export function ManagerGroupForm({
  mode,
  managerGroup,
}: ManagerGroupFormProps) {
  const router = useRouter();
  const [orgUnitFilter, setOrgUnitFilter] = useState<string>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  const { data: users = [], isLoading: isLoadingUsers } = useSWR<
    UserWithArchetype[]
  >("/users", fetchUsers);

  const { data: orgUnits = [], isLoading: isLoadingOrgUnits } = useSWR<
    OrgUnit[]
  >("/org-units", fetchOrgUnits);

  const isLoading = isLoadingUsers || isLoadingOrgUnits;

  const form = useForm<InsertManagerGroupInputFromForm>({
    resolver: zodResolver(insertManagerGroupSchemaFromForm),
    defaultValues: {
      name: managerGroup?.name || "",
      description: managerGroup?.description || "",
      members: managerGroup?.members || [],
    },
    mode: "onBlur",
  });

  const selectedMembers = form.watch("members") || [];

  const selectedMembersAsNumbers = selectedMembers.map((id: string) =>
    parseInt(id, 10),
  );

  const { execute: createManagerGroup, isPending: isCreating } = useAction(
    createManagerGroupAction,
    {
      onSuccess(args) {
        toast.success(args.data?.message || "Manager group created.");
        router.push("/admin/manager-groups");
      },
      onError() {
        toast.error("Something went wrong while creating the manager group.");
      },
    },
  );

  const { execute: updateManagerGroup, isPending: isUpdating } = useAction(
    updateManagerGroupAction,
    {
      onSuccess(args) {
        toast.success(args.data?.message || "Manager group updated.");
        router.push("/admin/manager-groups");
      },
      onError() {
        toast.error("Something went wrong while updating the manager group.");
      },
    },
  );

  async function onSubmit(values: InsertManagerGroupInputFromForm) {
    if (mode === "edit" && managerGroup?.id) {
      updateManagerGroup({ id: managerGroup.id, ...values });
    } else {
      createManagerGroup({ ...values });
    }
  }

  const isPending = isCreating || isUpdating;

  // Filter users based on selected filters
  const filteredUsers = users.filter((user) => {
    // Filter by org unit
    if (orgUnitFilter !== "all") {
      const selectedOrgUnitId = parseInt(orgUnitFilter, 10);
      const childOrgUnits = getAllChildOrgUnits(orgUnits, selectedOrgUnitId);
      const relevantOrgUnits = [selectedOrgUnitId, ...childOrgUnits];

      if (!user.orgUnitId || !relevantOrgUnits.includes(user.orgUnitId)) {
        return false;
      }
    }

    // Filter by user type
    if (userTypeFilter !== "all") {
      if (userTypeFilter === "Manager" && !user.isManager) {
        return false;
      }
      if (userTypeFilter === "User" && user.isManager) {
        return false;
      }
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        Loading data...
      </div>
    );
  }

  return (
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
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
                {/* Member list column */}
                <div className="flex-[2]">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem>
                        <div className="bg-muted/5 h-[400px] overflow-y-auto rounded-md border p-2">
                          {filteredUsers.map((user) => (
                            <FormField
                              key={user.id}
                              control={form.control}
                              name="members"
                              render={({ field }) => (
                                <FormItem
                                  key={user.id}
                                  className="hover:bg-muted flex flex-row items-start space-y-0 space-x-3 rounded-md p-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        user.id.toString(),
                                      )}
                                      onCheckedChange={(checked) => {
                                        const userId = user.id.toString();
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              userId,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== userId,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium">
                                      {user.fullName}
                                    </FormLabel>
                                    <div className="text-muted-foreground text-xs">
                                      {user.email}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                      {user.archetype?.name} •{" "}
                                      {getOrgUnitName(
                                        user.orgUnitId || null,
                                        orgUnits,
                                      )}
                                    </div>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                          {filteredUsers.length === 0 && (
                            <div className="text-muted-foreground py-4 text-center">
                              No users found. Try adjusting your filters.
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Filters column */}
                <div className="w-full max-w-[250px]">
                  <div className="bg-muted/5 space-y-6 rounded-md border p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Filter className="text-muted-foreground h-4 w-4" />
                        Org Unit
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
                          {getHierarchicalOrgUnitOptions(orgUnits).map(
                            (orgUnit) => (
                              <SelectItem
                                key={orgUnit.id}
                                value={orgUnit.id.toString()}
                                textValue={orgUnit.name}
                              >
                                {orgUnit.description}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Filter className="text-muted-foreground h-4 w-4" />
                        User Type
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
                          <SelectItem value="Manager">Managers</SelectItem>
                          <SelectItem value="User">Regular Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                {mode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : mode === "edit" ? (
              "Update Manager Group"
            ) : (
              "Create Manager Group"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
