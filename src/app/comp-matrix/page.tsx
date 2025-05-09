"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  mockEmployees,
  type Employee,
  mockOrgUnits,
  mockFunctions,
  type OrgUnit,
  type Function,
} from "~/data/mock-competency-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Building2, Users, UserRound } from "lucide-react";
import useSWR, { mutate } from "swr";
import { fetchCompMatrix } from "~/lib/client-api/comp-matrix";
import { fetchCompMatrixCurrentRating } from "~/lib/client-api/comp-matrix-current-rating";
import { fetchCompMatrixRatingOptions } from "~/lib/client-api/comp-matrix-rating-option";

import CompetencyMatrix from "./_components/competency-matrix";
import type { CompMatrixCellSavePayloadUI } from "~/server/queries/comp-matrix-current-rating";
import type { ViewMode, Phase } from "./_components/types";

const CompMatrixPage = () => {
  const [phase, setPhase] = useState<Phase>("assessment");
  const [viewMode, setViewMode] = useState<ViewMode>("employee");

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

  const switchPhase = (newPhase: Phase) => {
    setPhase(newPhase);
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

  const {
    data: ratingOptions,
    isLoading: isRatingOptionsLoading,
    error: ratingOptionsError,
  } = useSWR(`/api/comp-matrix-rating-option/${matrixId}`, () =>
    fetchCompMatrixRatingOptions(matrixId),
  );

  const assignmentId = 1; // baked in for now
  const {
    data: compMatrixCurrentRatings,
    isLoading: isCompMatrixCurrentRatingsLoading,
    error: compMatrixCurrentRatingsError,
  } = useSWR(
    assignmentId
      ? `/api/comp-matrix-current-ratings?assignmentId=${assignmentId}`
      : null,
    fetchCompMatrixCurrentRating,
  );

  const onSaveCell = async (uiPayload: CompMatrixCellSavePayloadUI) => {
    console.log("onSaveCell", uiPayload);
    const raterType = viewMode === "manager" ? "manager" : "employee";

    const apiPayload = {
      ...uiPayload,
      assignmentId,
      raterType,
    };

    const res = await fetch("/api/comp-matrix-current-ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiPayload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Save failed:", errorText);
      throw new Error("Save failed");
    }

    toast.success("Rating saved successfully");

    mutate(`/api/comp-matrix-current-ratings?assignmentId=${assignmentId}`);
  };

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

      <CompetencyMatrix
        phase={phase}
        viewMode={viewMode}
        selectedEmployee={selectedEmployee}
        compMatrix={compMatrix}
        ratingOptions={ratingOptions}
        compMatrixCurrentRating={compMatrixCurrentRatings}
        getCurrentEmployee={getCurrentEmployee}
        getCurrentOrgUnit={getCurrentOrgUnit}
        getCurrentFunction={getCurrentFunction}
        switchPhase={switchPhase}
        onSaveCell={onSaveCell}
      />
    </div>
  );
};

export default CompMatrixPage;
