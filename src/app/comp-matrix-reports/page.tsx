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
import { fetchUsersWithActiveMatrixAssignments } from "~/lib/client-api/users";
import type { UserWithArchetype } from "~/server/queries/user";
import {
  Building2 as Building2Icon,
  Users as UsersIcon,
  Filter as FilterIcon,
  Hammer as HammerIcon,
  LayoutDashboard as LayoutDashboardIcon,
  ArrowRightIcon,
} from "lucide-react";
import type { OrgUnit } from "~/server/queries/org-unit";

const CompMatrixReportsPage = () => {
  const [selectedReport, setSelectedReport] = React.useState<string | null>(
    null,
  );

  // Add filter state hooks
  const [selectedFunction, setSelectedFunction] = React.useState<number | null>(
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
  // SWR for users with active matrix assignments
  const { data: users = [] } = useSWR<UserWithArchetype[]>(
    "/api/users/with-active-matrix-assignments",
    fetchUsersWithActiveMatrixAssignments,
  );

  // Handlers for filter selects
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

  // Filter users by function, org unit (and children), and archetype
  const getFilteredEmployees = (): UserWithArchetype[] => {
    if (
      selectedFunction === null &&
      selectedOrgUnit === null &&
      selectedArchetype === null
    ) {
      return users;
    }

    return users.filter((user) => {
      if (selectedFunction !== null && user.functionId !== selectedFunction) {
        return false;
      }
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
              onValueChange={(value) => setSelectedReport(value)}
            >
              <SelectTrigger className="w-100" id="report-select">
                <SelectValue placeholder="Select report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">Average Ratings</SelectItem>
                <SelectItem value="gap">Competency Gaps</SelectItem>
                <SelectItem value="distribution">
                  Rating Distribution
                </SelectItem>
              </SelectContent>
            </Select>
            <button
              className="mt-4 flex !h-10 w-100 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={!selectedReport}
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
                  {buildHierarchicalOptions(orgUnits).map((ou) => (
                    <SelectItem key={ou.id} value={ou.id.toString()}>
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
      {/* Main content area (empty for now) */}
    </div>
  );
};

export default CompMatrixReportsPage;

// Helper to build hierarchical org unit options for display
const buildHierarchicalOptions = (
  units: OrgUnit[],
  parentId: number | null = null,
  level = 0,
): { id: number; description: string }[] => {
  return units
    .filter((u) => u.parentId === parentId)
    .flatMap((u) => [
      {
        id: u.id,
        description: `${level === 0 ? "" : "└"}${"— ".repeat(level)}${u.name}`,
      },
      ...buildHierarchicalOptions(units, u.id, level + 1),
    ]);
};
