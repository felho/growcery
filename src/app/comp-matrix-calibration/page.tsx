"use client";

import React, { useState, useMemo } from "react";
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
import { useRouter } from "next/navigation";
import { users, orgUnits, getOrgUnitName } from "~/server/db/data/mockData";
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
import type { ManagerGroupWithMembers } from "~/server/queries/manager-group";
import type {
  CompMatrix,
  CompMatrixWithFullRelations,
} from "~/server/queries/comp-matrix";
import type { User, UserWithCalibrationData } from "~/server/queries/user";

const archetypes = [
  "Senior Engineer",
  "Team Lead",
  "Product Manager",
  "Sales Manager",
  "Marketing Specialist",
];

// Mock calibration data
const mockCalibrationData = users.map((user) => ({
  ...user,
  archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
  overallRating: `${Math.floor(Math.random() * 6) + 1}.${Math.floor(Math.random() * 3) + 1}`,
  competencyRatings: {
    Craftsmanship: `${Math.floor(Math.random() * 6) + 1}.${Math.floor(Math.random() * 3) + 1}`,
    Collaboration: `${Math.floor(Math.random() * 6) + 1}.${Math.floor(Math.random() * 3) + 1}`,
    Leadership: `${Math.floor(Math.random() * 6) + 1}.${Math.floor(Math.random() * 3) + 1}`,
    Impact: `${Math.floor(Math.random() * 6) + 1}.${Math.floor(Math.random() * 3) + 1}`,
  },
  promotionChance: Math.random() > 0.7,
  subpromotionChance: Math.random() > 0.6,
}));

const CalibrationMeeting = () => {
  const router = useRouter();
  const [selectedManagerGroup, setSelectedManagerGroup] = useState<string>("");
  const [selectedMatrix, setSelectedMatrix] = useState<string>("");
  const [calibrationData, setCalibrationData] = useState(mockCalibrationData);
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

  // Update calibrationUsers state when fetchedCalibrationUsers changes
  React.useEffect(() => {
    if (fetchedCalibrationUsers) {
      setCalibrationUsers(fetchedCalibrationUsers);
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

  const isLoading = isLoadingManagerGroups || isLoadingMatrices;
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

  const handleRatingChange = (userId: string, type: string, value: string) => {
    setCalibrationData((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          if (type === "overall") {
            return { ...user, overallRating: value };
          } else {
            return {
              ...user,
              competencyRatings: {
                ...user.competencyRatings,
                [type]: value,
              },
            };
          }
        }
        return user;
      }),
    );
  };

  const handleCheckboxChange = (
    userId: string,
    type: "promotion" | "subpromotion",
    checked: boolean,
  ) => {
    setCalibrationData((prev) =>
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
      const matchesOrgUnit =
        filters.orgUnit === "all" ||
        user.orgUnitId?.toString() === filters.orgUnit;
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

        if (sortConfig.key === "overallRating") {
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
                  onValueChange={setSelectedManagerGroup}
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
                  onValueChange={setSelectedMatrix}
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
          </p>
        </div>
        <Button
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
                  {orgUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
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
                    <SelectItem key={archetype} value={archetype}>
                      {archetype}
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
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Name
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("orgUnit")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Org Unit
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("archetype")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Archetype
                      <ArrowUpDown className="ml-0 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[113px] text-xs font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("overallRating")}
                      className="h-auto p-0 hover:bg-transparent"
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
                        className="h-auto p-0 hover:bg-transparent"
                      >
                        {area.title.length > 6
                          ? `${area.title.slice(0, 6)}...`
                          : area.title}
                        <ArrowUpDown className="ml-0 h-4 w-4" />
                      </Button>
                    </TableHead>
                  ))}
                  <TableHead className="text-muted-foreground text-center text-xs font-medium">
                    Promotion
                  </TableHead>
                  <TableHead className="text-muted-foreground text-center text-xs font-medium">
                    Sub-promotion
                  </TableHead>
                  <TableHead className="text-muted-foreground text-center text-xs font-medium">
                    Matrix Link
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="pl-5">{person.fullName}</TableCell>
                    <TableCell className="pl-5">
                      <Badge variant="outline">{person.orgUnit?.name}</Badge>
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
                      <Checkbox
                        checked={person.promotionChance}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            person.id,
                            "promotion",
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={person.subpromotionChance}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            person.id,
                            "subpromotion",
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/competency-matrices/${selectedMatrix}`,
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
