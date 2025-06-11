"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Combobox } from "~/components/ui/combobox";
import {
  Building2 as Building2Icon,
  Users as UsersIcon,
  Filter as FilterIcon,
  User as UserIcon,
  ArrowRight as ArrowRightIcon,
  Hammer as HammerIcon,
} from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import useSWR from "swr";
import { fetchCompMatrix } from "~/lib/client-api/comp-matrix";
import { fetchCompMatrixCurrentRating } from "~/lib/client-api/comp-matrix-current-rating";
import { fetchCompMatrixRatingOptions } from "~/lib/client-api/comp-matrix-rating-option";
import { fetchFunctions } from "~/lib/client-api/functions";
import { fetchOrgUnits } from "~/lib/client-api/org-units";
import { fetchUserArchetypes } from "~/lib/client-api/user-archetypes";
import { fetchActiveUserCompMatrixAssignment } from "~/lib/client-api/user-comp-matrix-assignment";
import { fetchUsersWithActiveMatrixAssignments } from "~/lib/client-api/users";
import CompetencyMatrix from "./_components/competency-matrix";
import type { CompMatrixCellSavePayloadUI } from "~/server/queries/comp-matrix-current-rating";
import type { ViewMode, Phase } from "./_components/types";
import type { Function } from "~/server/queries/function";
import type { OrgUnit } from "~/server/queries/org-unit";
import type { UserWithArchetype } from "~/server/queries/user";
import type { UserArchetype } from "~/server/queries/user-archetype";
import {
  fetchCompMatrixLevelAssessments,
  fetchCompMatrixLevelAssessmentsByAssignmentIds,
} from "~/lib/client-api/comp-matrix-level-assessments";
import type { CompMatrixLevelAssessment } from "~/zod-schemas/comp-matrix-level-assessment";

const CompMatrixPage = () => {
  const searchParams = useSearchParams();

  // Get URL parameters
  const userIdParam = searchParams.get("userId");
  const viewModeParam = searchParams.get("viewMode") as ViewMode | null;
  const phaseParam = searchParams.get("phase") as Phase | null;
  const orgUnitIdParam = searchParams.get("orgUnitId");
  const archetypeIdParam = searchParams.get("archetypeId");
  const overallRatingParam = searchParams.get("overallRating");

  // Validate viewMode parameter
  const isValidViewMode = (mode: string | null): mode is ViewMode =>
    mode === "employee" || mode === "manager";

  // Validate phase parameter
  const isValidPhase = (p: string | null): p is Phase =>
    p === "assessment" || p === "joint-discussion" || p === "calibration";

  const [phase, setPhase] = useState<Phase>(
    isValidPhase(phaseParam) ? phaseParam : "assessment",
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    isValidViewMode(viewModeParam) ? viewModeParam : "employee",
  );
  const [isMatrixLoaded, setIsMatrixLoaded] = useState(false);

  // Selection state
  const [selectedFunction, setSelectedFunction] = useState<number | null>(null);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<number | null>(
    null,
  );
  const [selectedOverallRating, setSelectedOverallRating] = useState<
    string | null
  >(null);

  // Fetch data
  const { data: functions = [] } = useSWR<Function[]>(
    "/functions",
    fetchFunctions,
  );
  const { data: orgUnits = [] } = useSWR<OrgUnit[]>(
    "/org-units",
    fetchOrgUnits,
  );
  const { data: users = [] } = useSWR<UserWithArchetype[]>(
    "/api/users/with-active-matrix-assignments",
    fetchUsersWithActiveMatrixAssignments,
  );
  const { data: archetypes = [] } = useSWR<UserArchetype[]>(
    "/user-archetypes",
    fetchUserArchetypes,
  );

  // Initialize selections based on URL parameters when component mounts
  useEffect(() => {
    // Default: all selects start with "No filter" selected
    setSelectedFunction(null);

    // If orgUnitId parameter is provided, set the selected org unit
    if (orgUnitIdParam && !isNaN(parseInt(orgUnitIdParam))) {
      setSelectedOrgUnit(parseInt(orgUnitIdParam));
    } else {
      setSelectedOrgUnit(null);
    }

    // If archetypeId parameter is provided, set the selected archetype
    if (archetypeIdParam && !isNaN(parseInt(archetypeIdParam))) {
      setSelectedArchetype(parseInt(archetypeIdParam));
    } else {
      setSelectedArchetype(null);
    }
    
    // If overallRating parameter is provided, set the selected overall rating
    if (overallRatingParam && ["1", "2", "3", "4", "5", "6"].includes(overallRatingParam)) {
      setSelectedOverallRating(overallRatingParam);
    } else {
      setSelectedOverallRating(null);
    }

    // If userId parameter is provided, set the selected employee
    if (userIdParam && !isNaN(parseInt(userIdParam))) {
      const userId = parseInt(userIdParam);
      setSelectedEmployee(userId);
    } else {
      setSelectedEmployee(null);
    }
  }, [userIdParam, orgUnitIdParam, archetypeIdParam]);

  // Auto-load matrix when userId is provided via URL parameter
  useEffect(() => {
    // Only auto-load if we have a valid userId and the data is loaded (users array is populated)
    if (userIdParam && users.length > 0 && selectedEmployee) {
      const userExists = users.some((user) => user.id === selectedEmployee);
      if (userExists) {
        handleLoadMatrix();
      }
    }
  }, [users, selectedEmployee, userIdParam]);

  // Update function filter when employee is selected and has data
  useEffect(() => {
    if (selectedEmployee && users.length > 0) {
      const employee = users.find((user) => user.id === selectedEmployee);
      if (employee?.functionId) {
        setSelectedFunction(employee.functionId);
      }
    }
  }, [selectedEmployee, users]);

  const switchPhase = (newPhase: Phase) => {
    setPhase(newPhase);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const id = parseInt(employeeId);
    setSelectedEmployee(id);
    // Reset matrix data when new employee is selected
    setAssignment(null);
    setCompMatrixData(null);
    setCurrentRatings(null);
    setRatingOptions(null);
    setLevelAssessments([]);
    setIsMatrixLoaded(false);
  };

  const handleFunctionChange = (functionId: string) => {
    setSelectedFunction(
      functionId === "no-filter" ? null : parseInt(functionId),
    );
  };

  const handleOrgUnitChange = (orgUnitId: string) => {
    setSelectedOrgUnit(orgUnitId === "no-filter" ? null : parseInt(orgUnitId));
  };

  const handleArchetypeChange = (archetypeId: string) => {
    setSelectedArchetype(
      archetypeId === "no-filter" ? null : parseInt(archetypeId),
    );
  };
  
  const handleOverallRatingChange = (value: string) => {
    setSelectedOverallRating(value === "no-filter" ? null : value);
  };

  const getCurrentEmployee = (): UserWithArchetype | undefined => {
    return users.find((emp) => emp.id === selectedEmployee);
  };

  // Get filtered org units based on selected function
  const getFilteredOrgUnits = (): OrgUnit[] => {
    return orgUnits;
  };

  // Build hierarchical options for org units
  const buildHierarchicalOptions = (
    units: OrgUnit[],
    parentId: number | null = null,
    level = 0,
  ): { id: number; name: string; description: string }[] => {
    return units
      .filter((u) => u.parentId === parentId)
      .flatMap((u) => [
        {
          id: u.id,
          name: u.name, // Store the original name for keyboard navigation
          description: `${level == 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
        },
        ...buildHierarchicalOptions(units, u.id, level + 1),
      ]);
  };

  // Get hierarchical options for org units
  const getHierarchicalOrgUnitOptions = () => {
    return buildHierarchicalOptions(orgUnits);
  };

  // Get all child org units recursively
  const getAllChildOrgUnits = (parentId: number): number[] => {
    const directChildren = orgUnits
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => unit.id);

    const childrenOfChildren = directChildren.flatMap((childId) =>
      getAllChildOrgUnits(childId),
    );

    return [...directChildren, ...childrenOfChildren];
  };

  // --- All state declarations above this line ---

  // Get current function based on selected employee
  const getCurrentFunction = (): Function | undefined => {
    const employee = getCurrentEmployee();
    if (!employee) return undefined;
    return functions.find((func) => func.id === employee.functionId);
  };

  // Get current org unit based on selected employee
  const getCurrentOrgUnit = (): OrgUnit | undefined => {
    const employee = getCurrentEmployee();
    if (!employee) return undefined;
    return orgUnits.find((unit) => unit.id === employee.orgUnitId);
  };

  // Assignment state and effect
  const [assignment, setAssignment] = useState<any>(null);

  const [compMatrixData, setCompMatrixData] = useState<any>(null);
  const [ratingOptions, setRatingOptions] = useState<any>(null);
  const [compMatrixCurrentRatings, setCurrentRatings] = useState<any>(null);
  const [levelAssessments, setLevelAssessments] = useState<
    CompMatrixLevelAssessment[]
  >([]);

  // State for storing all level assessments for all users
  const [allLevelAssessments, setAllLevelAssessments] = useState<
    Record<number, CompMatrixLevelAssessment[]>
  >({});

  // Load all level assessments for all users
  useEffect(() => {
    const loadAllLevelAssessments = async () => {
      try {
        // Collect all assignment IDs
        const assignmentIds = users
          .filter(
            (user) =>
              Array.isArray((user as any).userCompMatrixAssignments) &&
              (user as any).userCompMatrixAssignments.length > 0,
          )
          .map((user) => (user as any).userCompMatrixAssignments[0].id);

        if (assignmentIds.length === 0) return;

        // Fetch all level assessments
        const assessments =
          await fetchCompMatrixLevelAssessmentsByAssignmentIds(assignmentIds);
        setAllLevelAssessments(assessments);
      } catch (error) {
        console.error("Error loading all level assessments:", error);
      }
    };

    if (users.length > 0) {
      loadAllLevelAssessments();
    }
  }, [users]);

  // Get filtered employees based on selected filters
  const getFilteredEmployees = (): UserWithArchetype[] => {
    return users.filter((user) => {
      // Filter by function if selected
      if (selectedFunction !== null && user.functionId !== selectedFunction)
        return false;
      // Filter by org unit if selected
      if (selectedOrgUnit !== null) {
        const childOrgUnits = getAllChildOrgUnits(selectedOrgUnit as number);
        if (
          user.orgUnitId !== selectedOrgUnit &&
          !childOrgUnits.includes(user.orgUnitId as number)
        )
          return false;
      }
      // Filter by archetype if selected
      if (selectedArchetype !== null && user.archetypeId !== selectedArchetype)
        return false;
      // Filter by overall rating if selected
      if (selectedOverallRating && selectedOverallRating !== "no-filter") {
        // Find the general (overall) level assessment for the user's active assignment
        const assignments = (user as any).userCompMatrixAssignments as
          | { id: number }[]
          | undefined;
        const assignmentId = assignments?.[0]?.id;
        if (!assignmentId) return false;

        // Get the user's level assessments from the allLevelAssessments state
        const userAssessments = allLevelAssessments[assignmentId] || [];
        const overall = userAssessments.find((la) => la.isGeneral);

        if (!overall) return false;
        const mainLevel = overall.mainLevel;
        if (mainLevel?.toString() !== selectedOverallRating) return false;
      }
      return true;
    });
  };

  // Reference user IDs for comparison in the matrix
  const referenceUserIds = getFilteredEmployees()
    .filter((u) => u.id !== selectedEmployee)
    .map((u) => u.id);

  const handleLoadMatrix = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee first");
      return;
    }

    try {
      // Load assignment
      const assignmentData =
        await fetchActiveUserCompMatrixAssignment(selectedEmployee);
      if (!assignmentData || !assignmentData.id) {
        toast.error("No assignment found for the selected employee");
        return;
      }
      setAssignment(assignmentData);

      // Load matrix data
      const [matrix, ratings, options, assessments] = await Promise.all([
        fetchCompMatrix(assignmentData.compMatrixId),
        fetchCompMatrixCurrentRating(assignmentData.id),
        fetchCompMatrixRatingOptions(assignmentData.compMatrixId),
        fetchCompMatrixLevelAssessments(assignmentData.id),
      ]);

      setCompMatrixData(matrix);
      setCurrentRatings(ratings);
      setRatingOptions(options);
      setLevelAssessments(assessments);

      setIsMatrixLoaded(true);
      toast.success("Matrix loaded successfully");
    } catch (err) {
      console.error("Error loading matrix data:", err);
      toast.error("Failed to load matrix data");
      setIsMatrixLoaded(false);
    }
  };

  const onSaveCell = async (uiPayload: CompMatrixCellSavePayloadUI) => {
    if (!assignment?.id) {
      toast.error("No assignment found for the selected employee");
      return;
    }

    const raterType = viewMode === "manager" ? "manager" : "employee";

    const apiPayload = {
      ...uiPayload,
      assignmentId: assignment.id,
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

    const ratings = await fetchCompMatrixCurrentRating(
      assignment.id.toString(),
    );
    setCurrentRatings(ratings);
    // mutate(`/api/comp-matrix-current-ratings?assignmentId=${assignment.id}`);
  };

  const handleLevelAssessmentSave = async () => {
    if (!assignment?.id) return;

    try {
      const assessments = await fetchCompMatrixLevelAssessments(assignment.id);
      setLevelAssessments(assessments);
    } catch (error) {
      console.error("Error refreshing level assessments:", error);
      toast.error("Failed to refresh level assessments");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="mb-0.5 text-3xl font-bold">Competency Matrix</h1>
      <p className="text-muted-foreground mt-1 mb-4">
        View and manage competency assessments
      </p>
      <div className="flex flex-row items-start gap-4 p-6 pb-6">
        {/* Left Column: Skills Assessment */}
        <div className="min-w-[340px]">
          <div className="mb-2">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="employee-select"
            >
              <div className="mb-1 flex items-center gap-2">
                <UserIcon className="text-primary h-5 w-5" />
                <h2 className="text-lg font-semibold">Employee Selection</h2>
              </div>
            </label>
            <p className="text-muted-foreground mb-3 text-sm">
              Select an employee to view their competency matrix
            </p>
            <Combobox
              id="employee-select"
              items={getFilteredEmployees().map((employee) => ({
                label: employee.fullName,
                value: employee.id.toString(),
              }))}
              placeholder="Select employee"
              value={selectedEmployee?.toString()}
              onChange={handleEmployeeChange}
            />
          </div>
          <button
            className="mt-4 flex !h-10 w-100 items-center justify-center gap-x-2 rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedEmployee}
            onClick={handleLoadMatrix}
            type="button"
          >
            <ArrowRightIcon className="h-5 w-5" />
            <span>Load Matrix</span>
          </button>
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="view-mode"
              checked={viewMode === "manager"}
              onCheckedChange={(checked) =>
                setViewMode(checked ? "manager" : "employee")
              }
            />
            <Label htmlFor="view-mode" className="text-sm font-medium">
              {viewMode === "manager" ? "Manager View" : "Employee View"}
            </Label>
          </div>
        </div>
        {/* Right Column: Filter Employees */}
        <div className="ml-10 flex-1 pt-0">
          <div className="mb-0.5 flex items-center gap-2">
            <FilterIcon className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Employees</h2>
          </div>
          <p className="text-muted-foreground mb-3 text-sm">
            Optionally filter the employee list to narrow your selection
          </p>
          <div className="bg-muted border-muted-foreground/10 flex !h-25 w-full flex-1 flex-row gap-4 rounded-lg border p-4 shadow-sm">
            <div className="flex-1">
              <label
                className="text-muted-foreground mb-1 ml-1 flex items-center text-sm font-medium"
                htmlFor="function-select"
              >
                <Building2Icon className="mr-2 h-4 w-4" />
                Function
              </label>
              <Select
                value={
                  selectedFunction === null
                    ? "no-filter"
                    : selectedFunction.toString()
                }
                onValueChange={handleFunctionChange}
              >
                <SelectTrigger className="w-full" id="function-select">
                  <SelectValue placeholder="Select function" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-filter">No filter</SelectItem>
                  {functions.map((func) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label
                className="text-muted-foreground mb-1 ml-1 flex items-center text-sm font-medium"
                htmlFor="orgunit-select"
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                Org Unit
              </label>
              <Select
                value={
                  selectedOrgUnit === null
                    ? "no-filter"
                    : selectedOrgUnit.toString()
                }
                onValueChange={handleOrgUnitChange}
              >
                <SelectTrigger className="w-full" id="orgunit-select">
                  <SelectValue placeholder="Select org unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-filter">No filter</SelectItem>
                  {getHierarchicalOrgUnitOptions().map((orgUnit) => (
                    <SelectItem
                      key={orgUnit.id}
                      value={orgUnit.id.toString()}
                      textValue={orgUnit.name} // Add textValue for keyboard navigation
                      data-name={orgUnit.name} // Add data-name attribute for reference
                    >
                      {orgUnit.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label
                className="text-muted-foreground mb-1 ml-1 flex items-center text-sm font-medium"
                htmlFor="archetype-select"
              >
                <HammerIcon className="mr-2 h-4 w-4" />
                Archetype
              </label>
              <Select
                value={
                  selectedArchetype === null
                    ? "no-filter"
                    : selectedArchetype.toString()
                }
                onValueChange={handleArchetypeChange}
              >
                <SelectTrigger className="w-full" id="archetype-select">
                  <SelectValue placeholder="Select archetype" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-filter">No filter</SelectItem>
                  {archetypes.map((archetype) => (
                    <SelectItem
                      key={archetype.id}
                      value={archetype.id.toString()}
                    >
                      {archetype.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label
                className="text-muted-foreground mb-1 ml-1 flex items-center text-sm font-medium"
                htmlFor="overall-rating-select"
              >
                <FilterIcon className="mr-2 h-4 w-4" />
                Overall Rating
              </label>
              <Select
                value={selectedOverallRating || "no-filter"}
                onValueChange={handleOverallRatingChange}
              >
                <SelectTrigger className="w-full" id="overall-rating-select">
                  <SelectValue placeholder="Select overall rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-filter">No filter</SelectItem>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                    >{`${num}.x`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isMatrixLoaded &&
        selectedEmployee &&
        compMatrixData &&
        compMatrixCurrentRatings &&
        ratingOptions && (
          <CompetencyMatrix
            key={`matrix-${selectedEmployee}-${assignment?.id ?? "none"}`}
            phase={phase}
            viewMode={viewMode}
            selectedEmployee={selectedEmployee.toString()}
            compMatrix={compMatrixData}
            ratingOptions={ratingOptions}
            compMatrixCurrentRating={compMatrixCurrentRatings}
            getCurrentEmployee={getCurrentEmployee}
            getCurrentOrgUnit={getCurrentOrgUnit}
            getCurrentFunction={getCurrentFunction}
            switchPhase={switchPhase}
            onSaveCell={onSaveCell}
            referenceUserIds={referenceUserIds}
            userCompMatrixAssignmentId={assignment?.id}
            levelAssessments={levelAssessments}
            onLevelAssessmentSave={handleLevelAssessmentSave}
          />
        )}
    </div>
  );
};

export default CompMatrixPage;
