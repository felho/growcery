"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { ArrowUpDown, Filter, ExternalLink } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchOrgUnits } from "~/lib/client-api/org-units";
import { fetchUserArchetypes } from "~/lib/client-api/user-archetypes";
import RatingSelector from "./_components/rating-selector";
import useSWR from "swr";
import {
  fetchManagerGroups,
  fetchManagerGroupById,
} from "~/lib/client-api/manager-groups";
import {
  fetchCompMatrices,
  fetchCompMatrix,
} from "~/lib/client-api/comp-matrix";
import { fetchCalibrationUsers } from "~/lib/client-api/calibration";
import { createLevelAssessmentAction } from "~/server/actions/comp-matrix-level-assessment/create";
import { updateLevelAssessmentAction } from "~/server/actions/comp-matrix-level-assessment/update";
import { toast } from "sonner";
import type { ManagerGroupWithMembers } from "~/server/queries/manager-group";
import type {
  CompMatrix,
  CompMatrixWithFullRelations,
} from "~/server/queries/comp-matrix";
import type { User, UserWithCalibrationData } from "~/server/queries/user";

// Type for calibration data with UI-specific fields
type CalibrationUserData = UserWithCalibrationData & {
  promotionChance: boolean;
  subpromotionChance: boolean;
};

const CalibrationMeeting = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedManagerGroup, setSelectedManagerGroup] = useState<string>("");
  const [selectedMatrix, setSelectedMatrix] = useState<string>("");
  const [calibrationData, setCalibrationData] = useState<CalibrationUserData[]>(
    [],
  );
  const [filters, setFilters] = useState({
    orgUnit: "all",
    archetype: "all",
    overallRating: "all",
    competencyRating: "all",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // State for storing the fetched matrix data
  const [matrixData, setMatrixData] =
    useState<CompMatrixWithFullRelations | null>(null);

  // State for storing calibration users (employees of managers with active matrix assignments)
  const [calibrationUsers, setCalibrationUsers] = useState<
    UserWithCalibrationData[]
  >([]);

  // Fetch manager groups and competency matrices from the database
  const { data: managerGroups = [], isLoading: isLoadingManagerGroups } =
    useSWR<ManagerGroupWithMembers[]>("/manager-groups", fetchManagerGroups);

  const { data: competencyMatrices = [], isLoading: isLoadingMatrices } =
    useSWR<CompMatrix[]>("/comp-matrices", fetchCompMatrices);

  // Fetch organization units
  const { data: orgUnits = [], isLoading: isLoadingOrgUnits } = useSWR(
    "/org-units",
    fetchOrgUnits,
  );

  // Fetch user archetypes
  const { data: archetypes = [], isLoading: isLoadingArchetypes } = useSWR(
    "/user-archetypes",
    fetchUserArchetypes,
  );

  // Fetch managers when a manager group is selected
  const {
    data: selectedManagerGroupData,
    isLoading: isLoadingManagerGroupData,
  } = useSWR<ManagerGroupWithMembers>(
    selectedManagerGroup ? `/manager-groups/${selectedManagerGroup}` : null,
    selectedManagerGroup
      ? () => fetchManagerGroupById(parseInt(selectedManagerGroup, 10))
      : null,
  );

  // Extract managers from the selected manager group
  const managers = selectedManagerGroupData?.members || [];

  // Define competency areas for each matrix (temporary solution until we fetch areas from DB)
  const matrixAreasMap = {
    // Default areas for engineering matrices
    engineering: ["Craftsmanship", "Collaboration", "Leadership", "Impact"],
    // Default areas for sales matrices
    sales: ["Sales Skills", "Customer Focus", "Leadership", "Results"],
    // Default fallback
    default: ["Technical Skills", "Collaboration", "Leadership", "Impact"],
  };

  // Find the selected matrix and determine its areas
  const selectedMatrixObj = competencyMatrices.find(
    (m) => m.id.toString() === selectedMatrix,
  );

  // Fetch detailed competency matrix data when a matrix is selected
  const { data: fetchedMatrixData } = useSWR<CompMatrixWithFullRelations>(
    selectedMatrix ? `/comp-matrices/${selectedMatrix}` : null,
    selectedMatrix ? () => fetchCompMatrix(parseInt(selectedMatrix, 10)) : null,
  );

  // Update matrixData state when fetchedMatrixData changes
  React.useEffect(() => {
    if (fetchedMatrixData) {
      setMatrixData(fetchedMatrixData);
    }
  }, [fetchedMatrixData]);

  // Fetch calibration users when both manager group and matrix are selected
  const { data: fetchedCalibrationUsers } = useSWR(
    selectedManagerGroup && selectedMatrix
      ? `/api/calibration/users?managerGroupId=${selectedManagerGroup}&matrixId=${selectedMatrix}`
      : null,
    selectedManagerGroup && selectedMatrix
      ? () =>
          fetchCalibrationUsers(
            parseInt(selectedManagerGroup, 10),
            parseInt(selectedMatrix, 10),
          )
      : null,
  );

  // Read URL parameters on component mount
  useEffect(() => {
    const managerGroupId = searchParams.get("managerGroupId");
    const matrixId = searchParams.get("matrixId");
    const orgUnitFilter = searchParams.get("orgUnit");
    const archetypeFilter = searchParams.get("archetype");
    const overallRatingFilter = searchParams.get("overallRating");

    if (managerGroupId) {
      setSelectedManagerGroup(managerGroupId);
    }

    if (matrixId) {
      setSelectedMatrix(matrixId);
    }

    // Apply filter values from URL parameters
    setFilters((prev) => ({
      ...prev,
      orgUnit: orgUnitFilter || "all",
      archetype: archetypeFilter || "all",
      overallRating: overallRatingFilter || "all",
    }));
  }, [searchParams]);

  // Update URL when selections or filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedManagerGroup) {
      params.set("managerGroupId", selectedManagerGroup);
    }

    if (selectedMatrix) {
      params.set("matrixId", selectedMatrix);
    }

    // Add filter parameters to URL if they're not set to "all"
    if (filters.orgUnit !== "all") {
      params.set("orgUnit", filters.orgUnit);
    }

    if (filters.archetype !== "all") {
      params.set("archetype", filters.archetype);
    }

    if (filters.overallRating !== "all") {
      params.set("overallRating", filters.overallRating);
    }

    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [selectedManagerGroup, selectedMatrix, filters]);

  // Update calibrationUsers state when fetchedCalibrationUsers changes
  React.useEffect(() => {
    if (fetchedCalibrationUsers) {
      setCalibrationUsers(fetchedCalibrationUsers);

      // Transform fetched users to include UI state properties
      const transformedData: CalibrationUserData[] =
        fetchedCalibrationUsers.map((user) => ({
          ...user,
          promotionChance: false,
          subpromotionChance: false,
        }));

      setCalibrationData(transformedData);
      console.log("Fetched calibration users:", fetchedCalibrationUsers);
    }
  }, [fetchedCalibrationUsers]);

  // Temporary solution to provide competency areas until we fetch them from DB
  const selectedMatrixData = selectedMatrixObj
    ? {
        ...selectedMatrixObj,
        competencyAreas: matrixAreasMap.default,
      }
    : null;

  // Build hierarchical options for org units
  const buildHierarchicalOptions = (
    units: typeof orgUnits,
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

  // Get hierarchical options for org units
  const hierarchicalOrgUnitOptions = useMemo(() => {
    return buildHierarchicalOptions(orgUnits);
  }, [orgUnits]);

  const isLoading =
    isLoadingManagerGroups ||
    isLoadingMatrices ||
    isLoadingOrgUnits ||
    isLoadingArchetypes;
  const isLoadingCalibrationData = isLoadingManagerGroupData;
  const isSetupComplete = selectedManagerGroup && selectedMatrix;

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleRatingChange = async (
    userId: number,
    type: string,
    value: string,
  ) => {
    const [mainLevel, subLevel] = value.split(".").map(Number);
    if (!mainLevel || !subLevel) return;

    const user = calibrationUsers.find((u) => u.id === userId);
    if (!user || !matrixData) return;

    const isGeneral = type === "overall";
    const compMatrixAreaId = isGeneral ? undefined : parseInt(type);
    const existing = user.levelAssessments?.find((la) =>
      isGeneral
        ? la.isGeneral
        : la.compMatrixAreaId === compMatrixAreaId && !la.isGeneral,
    );

    const data = {
      userCompMatrixAssignmentId: user.activeCompMatrixAssignmentId,
      compMatrixId: matrixData.id,
      isGeneral,
      compMatrixAreaId: compMatrixAreaId,
      mainLevel,
      subLevel,
    };

    try {
      if (existing?.mainLevel && existing?.subLevel) {
        await updateLevelAssessmentAction(data);
        toast.success("Assessment updated successfully");
      } else {
        await createLevelAssessmentAction(data);
        toast.success("Assessment created successfully");
      }

      setCalibrationUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const newAssessment = {
            ...data,
            id: existing?.id ?? Math.random(),
            createdAt: existing?.createdAt ?? new Date(),
            updatedAt: new Date(),
            compMatrixAreaId: data.compMatrixAreaId ?? null,
          };
          const rest =
            u.levelAssessments?.filter((la) =>
              isGeneral
                ? !la.isGeneral
                : la.compMatrixAreaId !== compMatrixAreaId,
            ) ?? [];
          return {
            ...u,
            levelAssessments: [...rest, newAssessment],
          };
        }),
      );
    } catch (e) {
      console.error("Failed to save assessment", e);
      toast.error("Failed to save assessment");
    }
  };

  const handleCheckboxChange = (
    userId: number,
    type: "promotion" | "subpromotion",
    checked: boolean,
  ) => {
    setCalibrationData((prev: CalibrationUserData[]) =>
      prev.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            [type === "promotion" ? "promotionChance" : "subpromotionChance"]:
              checked,
          };
        }
        return user;
      }),
    );
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = calibrationUsers.filter((user) => {
      // For org unit filtering, include users from child org units
      let matchesOrgUnit = filters.orgUnit === "all";

      if (!matchesOrgUnit && user.orgUnitId) {
        // Direct match
        if (user.orgUnitId.toString() === filters.orgUnit) {
          matchesOrgUnit = true;
        } else if (filters.orgUnit !== "all") {
          // Check if user's org unit is a child of the selected org unit
          const selectedOrgUnitId = parseInt(filters.orgUnit, 10);
          const childOrgUnitIds = getAllChildOrgUnits(selectedOrgUnitId);
          matchesOrgUnit = childOrgUnitIds.includes(user.orgUnitId);
        }
      }

      const matchesArchetype =
        filters.archetype === "all" ||
        user.archetype?.name === filters.archetype;

      const matchesOverallRating =
        filters.overallRating === "all" ||
        user.levelAssessments
          ?.find((la) => la.isGeneral)
          ?.mainLevel.toString() === filters.overallRating;

      return matchesOrgUnit && matchesArchetype && matchesOverallRating;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const getOverall = (u: UserWithCalibrationData) =>
          u.levelAssessments?.find((la) => la.isGeneral)?.mainLevel ?? 0;

        const getAreaRating = (u: UserWithCalibrationData, areaId: number) =>
          u.levelAssessments?.find(
            (la) => la.compMatrixAreaId === areaId && !la.isGeneral,
          )?.mainLevel ?? 0;

        let aValue: any;
        let bValue: any;

        if (sortConfig.key === "name") {
          aValue = a.fullName?.toLowerCase() ?? "";
          bValue = b.fullName?.toLowerCase() ?? "";
        } else if (sortConfig.key === "orgUnit") {
          aValue = a.orgUnit?.name?.toLowerCase() ?? "";
          bValue = b.orgUnit?.name?.toLowerCase() ?? "";
        } else if (sortConfig.key === "archetype") {
          aValue = a.archetype?.name?.toLowerCase() ?? "";
          bValue = b.archetype?.name?.toLowerCase() ?? "";
        } else if (sortConfig.key === "overallRating") {
          aValue = getOverall(a);
          bValue = getOverall(b);
        } else if (
          matrixData?.areas.some(
            (area) => area.id.toString() === sortConfig.key,
          )
        ) {
          const areaId = parseInt(sortConfig.key);
          aValue = getAreaRating(a, areaId);
          bValue = getAreaRating(b, areaId);
        } else {
          aValue = a[sortConfig.key as keyof typeof a];
          bValue = b[sortConfig.key as keyof typeof b];
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [calibrationUsers, filters, sortConfig, matrixData]);

  if (!isSetupComplete) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calibration Meeting</h1>
          <p className="text-muted-foreground mt-1">
            Select manager group and competency matrix to start the calibration
            session
          </p>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading data...
          </div>
        ) : (
          <div className="grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Manager Group</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedManagerGroup}
                  onValueChange={(value) => {
                    setSelectedManagerGroup(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a manager group" />
                  </SelectTrigger>
                  <SelectContent>
                    {managerGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Competency Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedMatrix}
                  onValueChange={(value) => {
                    setSelectedMatrix(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a competency matrix" />
                  </SelectTrigger>
                  <SelectContent>
                    {competencyMatrices.map((matrix) => (
                      <SelectItem key={matrix.id} value={matrix.id.toString()}>
                        {matrix.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedManagerGroup && selectedMatrix && (
          <Card className="max-w-4xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4 text-lg">
                  Ready to start calibration session
                </p>
                {isLoadingCalibrationData ? (
                  <p className="text-muted-foreground">
                    Loading managers data...
                  </p>
                ) : managers.length === 0 ? (
                  <p className="text-muted-foreground">
                    No managers found in this group
                  </p>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-4">
                      {managers.length} managers will participate in this
                      calibration
                    </p>
                    <Button
                      onClick={() =>
                        setSelectedManagerGroup(selectedManagerGroup)
                      }
                    >
                      Start Calibration
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  console.log("Matrix data:", matrixData);
  console.log("Calibration users:", calibrationUsers);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calibration Session</h1>
          <p className="text-muted-foreground mt-1">
            {
              managerGroups.find(
                (g) => g.id.toString() === selectedManagerGroup,
              )?.name
            }{" "}
            • {matrixData?.title}
            {managers.length > 0 && ` • ${managers.length} managers`}
            {calibrationData.length > 0 && ` • ${calibrationData.length} calibrated users`}
          </p>
        </div>
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => {
            setSelectedManagerGroup("");
            setSelectedMatrix("");
          }}
        >
          Change Selection
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Org Unit</label>
              <Select
                value={filters.orgUnit}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, orgUnit: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  {hierarchicalOrgUnitOptions.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Archetype</label>
              <Select
                value={filters.archetype}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, archetype: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {archetypes.map((archetype) => (
                    <SelectItem key={archetype.id} value={archetype.name}>
                      {archetype.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Overall Rating</label>
              <Select
                value={filters.overallRating}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, overallRating: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {matrixData?.levels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.id}.x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground min-w-[170px] text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto cursor-pointer p-0 hover:bg-transparent"
                    >
                      Name
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("orgUnit")}
                      className="h-auto cursor-pointer p-0 hover:bg-transparent"
                    >
                      Org Unit
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("archetype")}
                      className="h-auto cursor-pointer p-0 hover:bg-transparent"
                    >
                      Archetype
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[113px] text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("overallRating")}
                      className="h-auto cursor-pointer p-0 hover:bg-transparent"
                    >
                      Overall
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>

                  {matrixData?.areas.map((area) => (
                    <TableHead
                      key={`${matrixData?.id}-area-${area.id}`}
                      className="text-muted-foreground min-w-[113px] text-xs font-medium"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(area.id.toString())}
                        className="h-auto cursor-pointer p-0 hover:bg-transparent"
                      >
                        {area.title.length > 6
                          ? `${area.title.slice(0, 6)}...`
                          : area.title}
                        <ArrowUpDown className="ml-0 h-4 w-4" />
                      </Button>
                    </TableHead>
                  ))}
                  <TableHead className="text-muted-foreground text-center text-xs font-medium">
                    Matrix Link
                  </TableHead>
                  {/* <TableHead className="text-muted-foreground text-center text-xs font-medium">
                    Promo pot.
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="pl-5">{person.fullName}</TableCell>
                    <TableCell className="pl-5">
                      <Badge variant="secondary">{person.orgUnit?.name}</Badge>
                    </TableCell>
                    <TableCell className="pl-5">
                      <Badge variant="secondary">
                        {person.archetype?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="pl-5">
                      <RatingSelector
                        value={
                          person.levelAssessments?.find((la) => la.isGeneral)
                            ? `${person.levelAssessments.find((la) => la.isGeneral)?.mainLevel}.${person.levelAssessments.find((la) => la.isGeneral)?.subLevel}`
                            : ""
                        }
                        onChange={(newValue) =>
                          handleRatingChange(person.id, "overall", newValue)
                        }
                      />
                    </TableCell>
                    {matrixData?.areas.map((area) => (
                      <TableCell key={area.id} className="pl-5">
                        <RatingSelector
                          value={
                            person.levelAssessments?.find(
                              (la) =>
                                la.compMatrixAreaId === area.id &&
                                !la.isGeneral,
                            )
                              ? `${
                                  person.levelAssessments.find(
                                    (la) =>
                                      la.compMatrixAreaId === area.id &&
                                      !la.isGeneral,
                                  )?.mainLevel
                                }.${
                                  person.levelAssessments.find(
                                    (la) =>
                                      la.compMatrixAreaId === area.id &&
                                      !la.isGeneral,
                                  )?.subLevel
                                }`
                              : ""
                          }
                          onChange={(newValue) =>
                            handleRatingChange(
                              person.id,
                              area.id.toString(),
                              newValue,
                            )
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          // Build URL with parameters
                          let matrixUrl = `/comp-matrix?userId=${person.id}&viewMode=manager&phase=calibration`;

                          // Add orgUnitId if available
                          if (person.orgUnitId) {
                            matrixUrl += `&orgUnitId=${person.orgUnitId}`;
                          }

                          // Add archetypeId if available
                          if (person.archetype?.id) {
                            matrixUrl += `&archetypeId=${person.archetype.id}`;
                          }

                          // Check if command (Mac) or control (Windows) key is pressed
                          if (e.metaKey || e.ctrlKey) {
                            // Open in new tab
                            window.open(matrixUrl, "_blank");
                          } else {
                            // Open in same tab
                            router.push(matrixUrl);
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    {/* <TableCell className="justify-end text-center">
                      M:
                      <Checkbox
                        className="border-primary ml-2"
                        checked={person.promotionChance}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            person.id,
                            "promotion",
                            checked as boolean,
                          )
                        }
                      />
                      <br />
                      S:
                      <Checkbox
                        className="border-primary ml-3"
                        checked={person.subpromotionChance}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            person.id,
                            "subpromotion",
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalibrationMeeting;
