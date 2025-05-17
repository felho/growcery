"use client";

import React, { useState } from "react";
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
import { fetchUsers } from "~/lib/client-api/users";
import type { CompMatrix } from "~/server/queries/comp-matrix";
import type { OrgUnit } from "~/server/queries/org-unit";
import type { Function } from "~/server/queries/function";
import type { UserArchetype } from "~/server/queries/user-archetype";
import type { UserWithArchetype } from "~/server/queries/user";

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
  const { data: users } = useSWR<UserWithArchetype[]>("users", fetchUsers);

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

      const response = await fetch("/api/comp-matrix/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to import file");
      }

      const result = await response.json();
      setTerminalOutput(result.messages);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  {...form.register("employeeName")}
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
                    {users?.map((user: UserWithArchetype) => (
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
                    {orgUnits?.map((unit: OrgUnit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
