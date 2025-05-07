"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "sonner";
import {
  mockCompetencyData,
  type CompetencyCategory,
  type Rating,
  mockEmployees,
  type Employee,
  mockOrgUnits,
  mockFunctions,
  type OrgUnit,
  type Function,
} from "~/data/mock-competency-data";
import CompetencyMatrixHeader from "./_components/competency-matrix-header";
import CompetencyAreaSection from "./_components/competency-area-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Building2, Users, UserRound } from "lucide-react";
import useSWR from "swr";
import { fetchCompMatrix } from "~/lib/client-api/comp-matrix";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import type { CompMatrixLevel } from "~/server/queries/comp-matrix-level";
import type { CompMatrixAreaWithFullRelations } from "~/server/queries/comp-matrix-area";

const CompetencyMatrix = () => {
  const [competencyData, setCompetencyData] = useState(mockCompetencyData);
  const [phase, setPhase] = useState<
    "assessment" | "discussion" | "calibration"
  >("assessment");
  const [viewMode, setViewMode] = useState<"employee" | "manager">("employee");

  // Selection state
  const [selectedFunction, setSelectedFunction] = useState(
    mockFunctions[0]?.id || "",
  );
  const [selectedOrgUnit, setSelectedOrgUnit] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Initialize default selections when component mounts
  useEffect(() => {
    // Set initial org unit based on selected function
    const orgUnitsInFunction = mockOrgUnits.filter(
      (unit) => unit.functionId === selectedFunction,
    );
    if (orgUnitsInFunction.length > 0) {
      setSelectedOrgUnit(orgUnitsInFunction[0]?.id || "");

      // Set initial employee based on selected org unit
      const employeesInOrgUnit = mockEmployees.filter(
        (emp) => emp.orgUnitId === orgUnitsInFunction[0]?.id,
      );
      if (employeesInOrgUnit.length > 0) {
        setSelectedEmployee(employeesInOrgUnit[0]?.id || "");
      } else {
        setSelectedEmployee("");
      }
    } else {
      setSelectedOrgUnit("");
      setSelectedEmployee("");
    }
  }, []);

  const updateCompetency = (
    categoryIndex: number,
    itemIndex: number,
    field: "employeeRating" | "managerRating" | "employeeNote" | "managerNote",
    value: Rating | string,
  ) => {
    const updatedCompetencyData = { ...competencyData };
    const competencyItem =
      updatedCompetencyData.competencies[categoryIndex]?.items[itemIndex];
    if (!competencyItem) return;

    if (field === "employeeRating" || field === "managerRating") {
      competencyItem[field] = value as Rating;
    } else {
      competencyItem[field] = value as string;
    }

    setCompetencyData(updatedCompetencyData);

    toast.success(`Updated ${field} for ${competencyItem.name}`);
  };

  const switchPhase = (
    newPhase: "assessment" | "discussion" | "calibration",
  ) => {
    setPhase(newPhase);

    // Reset view mode to employee when switching to assessment phase
    if (newPhase === "assessment") {
      setViewMode("employee");
    }
  };

  const handleFunctionChange = (functionId: string) => {
    setSelectedFunction(functionId);

    // Filter org units by function and reset the org unit selection
    const orgUnitsInFunction = mockOrgUnits.filter(
      (unit) => unit.functionId === functionId,
    );
    if (orgUnitsInFunction.length > 0) {
      setSelectedOrgUnit(orgUnitsInFunction[0]?.id || "");

      // Filter employees by new org unit and reset the employee selection
      const employeesInOrgUnit = mockEmployees.filter(
        (emp) => emp.orgUnitId === orgUnitsInFunction[0]?.id,
      );
      if (employeesInOrgUnit.length > 0) {
        setSelectedEmployee(employeesInOrgUnit[0]?.id || "");
      } else {
        setSelectedEmployee("");
      }
    } else {
      setSelectedOrgUnit("");
      setSelectedEmployee("");
    }
  };

  const handleOrgUnitChange = (orgUnitId: string) => {
    setSelectedOrgUnit(orgUnitId);

    // Filter employees by org unit and reset the employee selection
    const employeesInOrgUnit = mockEmployees.filter(
      (emp) => emp.orgUnitId === orgUnitId,
    );
    if (employeesInOrgUnit.length > 0) {
      setSelectedEmployee(employeesInOrgUnit[0]?.id || "");
    } else {
      setSelectedEmployee("");
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);

    // In a real app, you would fetch the employee's competency data here
    toast.success(`Now viewing ${getCurrentEmployee()?.name}'s assessment`);
  };

  const getCurrentEmployee = (): Employee | undefined => {
    return mockEmployees.find((emp) => emp.id === selectedEmployee);
  };

  // Get filtered org units based on selected function
  const getFilteredOrgUnits = (): OrgUnit[] => {
    return mockOrgUnits.filter((unit) => unit.functionId === selectedFunction);
  };

  // Get filtered employees based on selected org unit
  const getFilteredEmployees = (): Employee[] => {
    return mockEmployees.filter((emp) => emp.orgUnitId === selectedOrgUnit);
  };

  // Get current function
  const getCurrentFunction = (): Function | undefined => {
    return mockFunctions.find((func) => func.id === selectedFunction);
  };

  // Get current org unit
  const getCurrentOrgUnit = (): OrgUnit | undefined => {
    return mockOrgUnits.find((unit) => unit.id === selectedOrgUnit);
  };

  const matrixId = 1; // baked in for now
  const {
    data: compMatrix,
    isLoading: isMatrixLoading,
    error: matrixError,
  } = useSWR(`/api/comp-matrix/${matrixId}`, () => fetchCompMatrix(matrixId));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Competency Matrix</h1>
          <p className="text-muted-foreground mt-1">
            Assessment and calibration of competencies across engineering levels
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Function selector */}
          <div className="flex items-center gap-2">
            <Building2 className="text-muted-foreground h-4 w-4" />
            <Select
              value={selectedFunction}
              onValueChange={handleFunctionChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select function" />
              </SelectTrigger>
              <SelectContent>
                {mockFunctions.map((func) => (
                  <SelectItem key={func.id} value={func.id}>
                    {func.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Org Unit selector */}
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <Select
              value={selectedOrgUnit}
              onValueChange={handleOrgUnitChange}
              disabled={!selectedFunction}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredOrgUnits().map((orgUnit) => (
                  <SelectItem key={orgUnit.id} value={orgUnit.id}>
                    {orgUnit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee selector */}
          <div className="flex items-center gap-2">
            <UserRound className="text-muted-foreground h-4 w-4" />
            <Select
              value={selectedEmployee}
              onValueChange={handleEmployeeChange}
              disabled={!selectedOrgUnit}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredEmployees().map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {getCurrentEmployee()?.name
                  ? `${getCurrentEmployee()?.name}'s Competency Assessment`
                  : "Competency Assessment"}
              </CardTitle>
              <CardDescription>
                {getCurrentEmployee()?.position || ""}
                {getCurrentOrgUnit() && ` - ${getCurrentOrgUnit()?.name}`}
                {getCurrentFunction() && ` - ${getCurrentFunction()?.name}`}
              </CardDescription>
            </div>

            <Tabs
              defaultValue="assessment"
              value={phase}
              onValueChange={(value) => switchPhase(value as any)}
            >
              <TabsList>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="discussion">Joint Discussion</TabsTrigger>
                <TabsTrigger value="calibration">Calibration</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {selectedEmployee ? (
            <div className="border-border overflow-hidden rounded-md border">
              <CompetencyMatrixHeader levels={competencyData.levels} />

              {compMatrix?.areas?.map((area) => {
                const category = competencyData.competencies.find(
                  (c) => c.category === area.title,
                );
                if (!category) return null;

                return (
                  <CompetencyAreaSection
                    key={area.id}
                    area={area}
                    category={category}
                    phase={phase}
                    viewMode={viewMode}
                    updateCompetency={updateCompetency}
                    categoryIndex={competencyData.competencies.indexOf(
                      category,
                    )}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground p-8 text-center">
              Please select a function, team, and employee to view competency
              assessment
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyMatrix;
