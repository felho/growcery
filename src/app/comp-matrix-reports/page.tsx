"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useSWR from "swr";
import { fetchFunctions } from "~/lib/client-api/functions";
import { fetchOrgUnits } from "~/lib/client-api/org-units";
import { fetchUserArchetypes } from "~/lib/client-api/user-archetypes";
import { fetchCompMatrices } from "~/lib/client-api/comp-matrix";
import { fetchUsersWithActiveMatrixAssignments } from "~/lib/client-api/users";
import { fetchCompMatrixLevelAssessmentsByAssignmentIds } from "~/lib/client-api/comp-matrix-level-assessments";
import { fetchCompMatrixCurrentRatingsByUserIds } from "~/lib/client-api/comp-matrix-current-rating";
import { fetchCompMatrix } from "~/lib/client-api/comp-matrix";
import type { UserWithArchetypeAndAssignments } from "~/server/queries/user";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import {
  Building2 as Building2Icon,
  Users as UsersIcon,
  Filter as FilterIcon,
  Hammer as HammerIcon,
  LayoutDashboard as LayoutDashboardIcon,
  ArrowRightIcon,
} from "lucide-react";
import type { OrgUnit } from "~/server/queries/org-unit";
import { AverageRatingsReport } from "./_reports/average-ratings";
import { RatingDistributionReport } from "./_reports/rating-distribution";
import { CompetencyGapsReport } from "./_reports/competency-gaps";
import { LevelHistogram } from "./_reports/level-histogram";

const CompMatrixReportsPage = () => {
  const [selectedReport, setSelectedReport] = React.useState<string | null>(
    null,
  );
  const [reportLoaded, setReportLoaded] = React.useState(false);

  // Add filter state hooks
  const [selectedMatrixId, setSelectedMatrixId] = React.useState<number | null>(
    null,
  );
  const [selectedOrgUnit, setSelectedOrgUnit] = React.useState<number | null>(
    null,
  );
  const [selectedArchetype, setSelectedArchetype] = React.useState<
    number | null
  >(null);

  const { data: functions = [] } = useSWR("/functions", fetchFunctions);
  const { data: orgUnits = [] } = useSWR("/org-units", fetchOrgUnits);
  const { data: archetypes = [] } = useSWR(
    "/user-archetypes",
    fetchUserArchetypes,
  );
  const { data: matrices = [] } = useSWR("/comp-matrices", fetchCompMatrices);
  // SWR for users with active matrix assignments
  const { data: users = [] } = useSWR<UserWithArchetypeAndAssignments[]>(
    "/api/users/with-active-matrix-assignments",
    fetchUsersWithActiveMatrixAssignments,
  );

  const { data: selectedMatrix } = useSWR<CompMatrixWithFullRelations>(
    selectedMatrixId ? `/comp-matrices/${selectedMatrixId}` : null,
    () => fetchCompMatrix(selectedMatrixId!),
  );

  // Handlers for filter selects
  const handleOrgUnitChange = (orgUnitId: string) => {
    setSelectedOrgUnit(orgUnitId === "no-filter" ? null : parseInt(orgUnitId));
  };

  const handleArchetypeChange = (archetypeId: string) => {
    setSelectedArchetype(
      archetypeId === "no-filter" ? null : parseInt(archetypeId),
    );
  };

  // Recursively get all child org units
  const getAllChildOrgUnits = (parentId: number): number[] => {
    const directChildren = orgUnits
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => unit.id);
    const childrenOfChildren = directChildren.flatMap((childId) =>
      getAllChildOrgUnits(childId),
    );
    return [...directChildren, ...childrenOfChildren];
  };

  // Filter users by matrix, org unit (and children), and archetype
  const getFilteredEmployees = (): UserWithArchetypeAndAssignments[] => {
    if (!selectedMatrixId) return [];

    if (selectedOrgUnit === null && selectedArchetype === null) {
      return users;
    }

    return users.filter((user) => {
      if (selectedOrgUnit !== null) {
        const childOrgUnits = getAllChildOrgUnits(selectedOrgUnit);
        if (
          user.orgUnitId !== selectedOrgUnit &&
          !childOrgUnits.includes(user.orgUnitId as number)
        ) {
          return false;
        }
      }
      if (
        selectedArchetype !== null &&
        user.archetypeId !== selectedArchetype
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredEmployees = getFilteredEmployees();
  const userIds = filteredEmployees.map((u) => u.id);

  // compMatrixCurrentRatings should be an array of current rating records
  const { data: compMatrixCurrentRatings } = useSWR(
    userIds.length > 0 && selectedMatrixId !== null
      ? [
          "/api/comp-matrix-current-ratings/by-user-ids",
          userIds.sort().join(","),
        ]
      : null,
    () => fetchCompMatrixCurrentRatingsByUserIds(userIds),
  );

  // SWR for compMatrixLevelAssessments by assignmentIds
  const assignmentIds = filteredEmployees.flatMap(
    (u) => u.userCompMatrixAssignments?.map((a) => a.id) ?? [],
  );

  const { data: compMatrixLevelAssessments } = useSWR(
    assignmentIds.length > 0 && selectedMatrixId !== null
      ? [
          "/api/comp-matrix-level-assessments/by-assignment-ids",
          assignmentIds.join(","),
        ]
      : null,
    () => fetchCompMatrixLevelAssessmentsByAssignmentIds(assignmentIds),
  );

  // Calculate averages using calculationWeight from the ratingOption instead of managerRatingId directly
  const averageRatings: Record<number, { sum: number; count: number }> = {};

  if (Array.isArray(compMatrixCurrentRatings)) {
    for (const record of compMatrixCurrentRatings) {
      const defId = record.compMatrixDefinitionId;
      const ratingId = record.managerRatingId;

      if (ratingId == null) continue;

      const ratingOption = selectedMatrix?.ratingOptions.find(
        (opt) => opt.id === ratingId,
      );

      if (!ratingOption) continue;

      const weight = ratingOption.calculationWeight;

      if (!averageRatings[defId]) {
        averageRatings[defId] = { sum: 0, count: 0 };
      }
      averageRatings[defId].sum += weight;
      averageRatings[defId].count += 1;
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="mb-0.5 text-3xl font-bold">Competency Reports</h1>
      <p className="text-muted-foreground mt-1 mb-4">
        Explore aggregated insights from the competency matrix
      </p>
      <div className="flex flex-row items-start gap-4 p-6 pb-6">
        {/* Left Column: Report Selector */}
        <div className="min-w-[340px]">
          <div className="mb-2">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="report-select"
            >
              <div className="mb-1 flex items-center gap-2">
                <LayoutDashboardIcon className="text-primary h-5 w-5" />
                <h2 className="text-lg font-semibold">Report Selection</h2>
              </div>
            </label>
            <p className="text-muted-foreground mb-3 text-sm">
              Select a report to view insights
            </p>
            <Select
              value={selectedReport ?? undefined}
              onValueChange={(value) => {
                setSelectedReport(value);
                setReportLoaded(false);
              }}
            >
              <SelectTrigger className="w-100" id="report-select">
                <SelectValue placeholder="Select report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">Average Ratings</SelectItem>
                <SelectItem value="distribution">
                  Rating Distribution
                </SelectItem>
                <SelectItem value="gap">Competency Gaps</SelectItem>
                <SelectItem value="level-histogram">Level Histogram</SelectItem>
              </SelectContent>
            </Select>
            <button
              className="mt-4 flex !h-10 w-100 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={!selectedReport || !selectedMatrixId}
              onClick={() => setReportLoaded(true)}
            >
              <ArrowRightIcon className="h-5 w-5" />
              <span>Load Report</span>
            </button>
          </div>
        </div>
        {/* Right Column: Filter Employees */}
        <div className="ml-10 flex-1 pt-0">
          <div className="mb-0.5 flex items-center gap-2">
            <FilterIcon className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Employees</h2>
          </div>
          <p className="text-muted-foreground mb-3 text-sm">
            Optionally filter the employee list to narrow your report
          </p>
          <div className="bg-muted border-muted-foreground/10 flex !h-25 w-full flex-1 flex-row gap-4 rounded-lg border p-4 shadow-sm">
            <div className="flex-1">
              <label
                className="text-muted-foreground mb-1 ml-1 flex items-center text-sm font-medium"
                htmlFor="matrix-select"
              >
                <Building2Icon className="mr-2 h-4 w-4" />
                Matrix
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Select
                value={
                  selectedMatrixId === null
                    ? "no-filter"
                    : selectedMatrixId.toString()
                }
                onValueChange={(val) =>
                  setSelectedMatrixId(
                    val === "no-filter" ? null : parseInt(val),
                  )
                }
              >
                <SelectTrigger className="w-full" id="matrix-select">
                  <SelectValue placeholder="Select matrix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-filter">No filter</SelectItem>
                  {matrices.map((matrix) => (
                    <SelectItem key={matrix.id} value={matrix.id.toString()}>
                      {matrix.title}
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
                  {buildHierarchicalOptions(orgUnits).map((ou) => (
                    <SelectItem 
                      key={ou.id} 
                      value={ou.id.toString()}
                      textValue={ou.name} // Add textValue for keyboard navigation
                      data-name={ou.name} // Add data-name attribute for reference
                    >
                      {ou.description}
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
                  {archetypes.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      {/* Main content area */}

      {selectedMatrix && reportLoaded && selectedReport === "average" && (
        <AverageRatingsReport
          selectedMatrix={selectedMatrix}
          filteredEmployees={filteredEmployees}
          compMatrixCurrentRatings={compMatrixCurrentRatings}
          selectedOrgUnit={selectedOrgUnit}
          selectedArchetype={selectedArchetype}
          orgUnits={orgUnits}
          archetypes={archetypes}
        />
      )}

      {selectedMatrix && reportLoaded && selectedReport === "distribution" && (
        <RatingDistributionReport
          selectedMatrix={selectedMatrix}
          filteredEmployees={filteredEmployees}
          compMatrixCurrentRatings={compMatrixCurrentRatings}
          selectedOrgUnit={selectedOrgUnit}
          selectedArchetype={selectedArchetype}
          orgUnits={orgUnits}
          archetypes={archetypes}
        />
      )}

      {selectedMatrix && reportLoaded && selectedReport === "gap" && (
        <CompetencyGapsReport
          selectedMatrix={selectedMatrix}
          filteredEmployees={filteredEmployees}
          compMatrixCurrentRatings={compMatrixCurrentRatings}
          selectedOrgUnit={selectedOrgUnit}
          selectedArchetype={selectedArchetype}
          orgUnits={orgUnits}
          archetypes={archetypes}
        />
      )}

      {selectedMatrix &&
        reportLoaded &&
        selectedReport === "level-histogram" &&
        compMatrixLevelAssessments && (
          <LevelHistogram
            data={Object.values(compMatrixLevelAssessments).flat()}
          />
        )}
    </div>
  );
};

export default CompMatrixReportsPage;

// Helper to build hierarchical org unit options for display
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
        description: `${level === 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
      },
      ...buildHierarchicalOptions(units, u.id, level + 1),
    ]);
};
