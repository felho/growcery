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
import {
  Building2 as Building2Icon,
  Users as UsersIcon,
  Filter as FilterIcon,
  Hammer as HammerIcon,
  LayoutDashboard as LayoutDashboardIcon,
} from "lucide-react";
import type { OrgUnit } from "~/server/queries/org-unit";

const CompMatrixReportsPage = () => {
  const { data: functions = [] } = useSWR("/functions", fetchFunctions);
  const { data: orgUnits = [] } = useSWR("/org-units", fetchOrgUnits);
  const { data: archetypes = [] } = useSWR(
    "/user-archetypes",
    fetchUserArchetypes,
  );
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
            <Select>
              <SelectTrigger className="w-full" id="report-select">
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
              <Select>
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
              {/* Hierarchical Org Unit Select */}
              <Select>
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
              <Select>
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
