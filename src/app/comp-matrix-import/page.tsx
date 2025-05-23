"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { fetchCompMatrices } from "~/lib/client-api/comp-matrix";
import { fetchOrgUnits } from "~/lib/client-api/org-units";
import { fetchFunctions } from "~/lib/client-api/functions";
import { fetchUserArchetypes } from "~/lib/client-api/user-archetypes";
import {
  fetchUsersWithActiveMatrixAssignments,
  fetchUsers,
} from "~/lib/client-api/users";
import { fetchActiveUserCompMatrixAssignment } from "~/lib/client-api/user-comp-matrix-assignment";
import type { CompMatrix } from "~/server/queries/comp-matrix";
import type { OrgUnit } from "~/server/queries/org-unit";
import type { Function } from "~/server/queries/function";
import type { UserArchetype } from "~/server/queries/user-archetype";
import type { UserWithArchetype } from "~/server/queries/user";
import { Combobox } from "~/components/ui/combobox";

function buildHierarchicalOptions(
  units: OrgUnit[],
  parentId: number | null = null,
  level = 0,
): { id: number; description: string }[] {
  return units
    .filter((u) => u.parentId === parentId)
    .flatMap((u) => [
      {
        id: u.id,
        description: `${level == 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
      },
      ...buildHierarchicalOptions(units, u.id, level + 1),
    ]);
}

const formSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  employeeEmail: z.string().email("Invalid email address"),
  managerId: z.string().min(1, "Manager is required"),
  functionId: z.string().min(1, "Function is required"),
  orgUnitId: z.string().min(1, "Organization unit is required"),
  archetypeId: z.string().min(1, "Archetype is required"),
  matrixId: z.string().min(1, "Matrix is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function CompMatrixImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [savedLevelAssessments, setSavedLevelAssessments] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const employeeNameRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: "",
      employeeEmail: "",
      managerId: "",
      functionId: "",
      orgUnitId: "",
      archetypeId: "",
      matrixId: "",
    },
  });

  // Data fetching
  const { data: matrices } = useSWR<CompMatrix[]>(
    "comp-matrices",
    fetchCompMatrices,
  );
  const { data: orgUnits } = useSWR<OrgUnit[]>("org-units", fetchOrgUnits);
  const { data: functions } = useSWR<Function[]>("functions", fetchFunctions);
  const { data: archetypes } = useSWR<UserArchetype[]>(
    "user-archetypes",
    fetchUserArchetypes,
  );
  const { data: users } = useSWR<UserWithArchetype[]>(
    "users",
    fetchUsersWithActiveMatrixAssignments,
  );
  const { data: allUsers } = useSWR<UserWithArchetype[]>(
    "all-users",
    fetchUsers,
  );

  // Autofill logic
  React.useEffect(() => {
    if (!users) return;
    if (!selectedUserId || selectedUserId === "__new__") {
      // Clear fields for new user
      form.reset({
        employeeName: "",
        employeeEmail: "",
        managerId: "",
        functionId: "",
        orgUnitId: "",
        archetypeId: "",
        matrixId: form.getValues("matrixId"),
      });
      return;
    }
    const user = users.find((u) => u.id.toString() === selectedUserId);
    if (user) {
      form.setValue("employeeName", user.fullName || "");
      form.setValue("employeeEmail", user.email || "");
      form.setValue(
        "managerId",
        user.managerId ? user.managerId.toString() : "",
      );
      form.setValue(
        "functionId",
        user.functionId ? user.functionId.toString() : "",
      );
      form.setValue(
        "orgUnitId",
        user.orgUnitId ? user.orgUnitId.toString() : "",
      );
      form.setValue(
        "archetypeId",
        user.archetypeId ? user.archetypeId.toString() : "",
      );
      // Fetch active assignment and set matrixId if exists
      fetchActiveUserCompMatrixAssignment(Number(user.id)).then(
        (assignment) => {
          if (assignment && assignment.compMatrixId) {
            form.setValue("matrixId", assignment.compMatrixId.toString());
          }
        },
      );
    }
  }, [selectedUserId, users]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setTerminalOutput([]);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (!fileInput?.files?.[0]) {
        toast.error("Please select a file to upload");
        return;
      }
      formData.append("file", fileInput.files[0]);

      const response = await fetch("/api/comp-matrices/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to import file");
      }

      const result = await response.json();
      setTerminalOutput(result.messages);
      setSavedLevelAssessments(result.savedLevelAssessments || []);
      toast.success("File imported successfully");
    } catch (error) {
      console.error("Error importing file:", error);
      toast.error("Failed to import file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Import Competency Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          {/* User select combobox */}
          <div className="mb-6">
            <Label htmlFor="user-combobox">Select existing user</Label>
            <div className="w-1/2 max-w-md">
              <Combobox
                id="user-combobox"
                items={[
                  { label: "New user", value: "__new__" },
                  ...(users
                    ? users.map((u) => ({
                        label: `${u.fullName} (${u.email})`,
                        value: u.id.toString(),
                      }))
                    : []),
                ]}
                value={selectedUserId}
                onChange={(val) => {
                  setSelectedUserId(val);
                  if (val === "__new__" && employeeNameRef.current) {
                    setTimeout(() => employeeNameRef.current?.focus(), 0);
                  }
                }}
                placeholder="Select an existing user or start typing..."
              />
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  {...form.register("employeeName")}
                  ref={(el) => {
                    form.register("employeeName").ref(el);
                    employeeNameRef.current = el;
                  }}
                  placeholder="Enter employee name"
                />
                {form.formState.errors.employeeName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.employeeName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeEmail">Employee Email</Label>
                <Input
                  id="employeeEmail"
                  type="email"
                  {...form.register("employeeEmail")}
                  placeholder="Enter employee email"
                />
                {form.formState.errors.employeeEmail && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.employeeEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerId">Manager</Label>
                <Select
                  onValueChange={(value) => form.setValue("managerId", value)}
                  value={form.watch("managerId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers?.map((user: UserWithArchetype) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.managerId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.managerId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="functionId">Function</Label>
                <Select
                  onValueChange={(value) => form.setValue("functionId", value)}
                  value={form.watch("functionId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent>
                    {functions?.map((func: Function) => (
                      <SelectItem key={func.id} value={func.id.toString()}>
                        {func.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.functionId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.functionId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgUnitId">Organization Unit</Label>
                <Select
                  onValueChange={(value) => form.setValue("orgUnitId", value)}
                  value={form.watch("orgUnitId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgUnits &&
                      buildHierarchicalOptions(orgUnits).map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.description}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.orgUnitId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.orgUnitId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="archetypeId">Archetype</Label>
                <Select
                  onValueChange={(value) => form.setValue("archetypeId", value)}
                  value={form.watch("archetypeId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select archetype" />
                  </SelectTrigger>
                  <SelectContent>
                    {archetypes?.map((archetype: UserArchetype) => (
                      <SelectItem
                        key={archetype.id}
                        value={archetype.id.toString()}
                      >
                        {archetype.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.archetypeId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.archetypeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="matrixId">Matrix</Label>
                <Select
                  onValueChange={(value) => form.setValue("matrixId", value)}
                  value={form.watch("matrixId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select matrix" />
                  </SelectTrigger>
                  <SelectContent>
                    {matrices?.map((matrix: CompMatrix) => (
                      <SelectItem key={matrix.id} value={matrix.id.toString()}>
                        {matrix.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.matrixId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.matrixId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Excel File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  className="cursor-pointer"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Importing..." : "Import"}
            </Button>
          </form>

          {terminalOutput.length > 0 && (
            <div className="mt-6 rounded-lg bg-black p-4 font-mono text-sm text-white">
              {terminalOutput.map((line, index) => (
                <pre key={index} className="break-words whitespace-pre-wrap">
                  {line}
                </pre>
              ))}
              {savedLevelAssessments.length > 0 && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <div className="mb-2 font-bold">Level assessments saved:</div>
                  {savedLevelAssessments.map((a, i) => (
                    <div key={i}>
                      {a.type}: {a.mainLevel}.{a.subLevel}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
