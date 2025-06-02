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
import { users, orgUnits, getOrgUnitName } from "~/data/mockData";
import RatingSelector from "./_components/rating-selector";

// Mock data for manager groups and competency matrices
const managerGroups = [
  {
    id: "mg1",
    name: "Engineering Leadership",
    description: "Tech team managers",
  },
  { id: "mg2", name: "Sales Leadership", description: "Sales team managers" },
  {
    id: "mg3",
    name: "Product Leadership",
    description: "Product team managers",
  },
];

const competencyMatrices = [
  {
    id: "cm1",
    name: "Engineering Matrix",
    competencyAreas: ["Craftsmanship", "Collaboration", "Leadership", "Impact"],
  },
  {
    id: "cm2",
    name: "Sales Matrix",
    competencyAreas: [
      "Sales Skills",
      "Customer Focus",
      "Leadership",
      "Results",
    ],
  },
];

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

  const selectedMatrixData = competencyMatrices.find(
    (m) => m.id === selectedMatrix,
  );
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
    let filtered = calibrationData.filter((user) => {
      const matchesOrgUnit =
        filters.orgUnit === "all" || user.orgUnit === filters.orgUnit;
      const matchesArchetype =
        filters.archetype === "all" || user.archetype === filters.archetype;
      const matchesOverallRating =
        filters.overallRating === "all" ||
        user.overallRating.startsWith(filters.overallRating);

      return matchesOrgUnit && matchesArchetype && matchesOverallRating;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === "overallRating") {
          aValue = parseFloat(a.overallRating);
          bValue = parseFloat(b.overallRating);
        } else if (
          selectedMatrixData?.competencyAreas.includes(sortConfig.key)
        ) {
          aValue = parseFloat(a.competencyRatings[sortConfig.key] || "0");
          bValue = parseFloat(b.competencyRatings[sortConfig.key] || "0");
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
  }, [calibrationData, filters, sortConfig, selectedMatrixData]);

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
                    <SelectItem key={group.id} value={group.id}>
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
              <Select value={selectedMatrix} onValueChange={setSelectedMatrix}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a competency matrix" />
                </SelectTrigger>
                <SelectContent>
                  {competencyMatrices.map((matrix) => (
                    <SelectItem key={matrix.id} value={matrix.id}>
                      {matrix.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {selectedManagerGroup && selectedMatrix && (
          <Card className="max-w-4xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4 text-lg">
                  Ready to start calibration session
                </p>
                <Button
                  onClick={() => setSelectedManagerGroup(selectedManagerGroup)}
                >
                  Start Calibration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calibration Session</h1>
          <p className="text-muted-foreground mt-1">
            {managerGroups.find((g) => g.id === selectedManagerGroup)?.name} •{" "}
            {selectedMatrixData?.name}
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
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}.x
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
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("orgUnit")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Org Unit <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("archetype")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Archetype <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("overallRating")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Overall <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  {selectedMatrixData?.competencyAreas.map((area) => (
                    <TableHead key={area} className="min-w-[120px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(area)}
                        className="h-auto p-0 hover:bg-transparent"
                      >
                        {area} <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Promotion</TableHead>
                  <TableHead className="text-center">Sub-promotion</TableHead>
                  <TableHead className="text-center">Matrix Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getOrgUnitName(person.orgUnit)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{person.archetype}</Badge>
                    </TableCell>
                    <TableCell>
                      <RatingSelector
                        value={person.overallRating}
                        onChange={(value) =>
                          handleRatingChange(person.id, "overall", value)
                        }
                      />
                    </TableCell>
                    {selectedMatrixData?.competencyAreas.map((area) => (
                      <TableCell key={area}>
                        <RatingSelector
                          value={person.competencyRatings[area]}
                          onChange={(value) =>
                            handleRatingChange(person.id, area, value)
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
