"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import {
  type CompetencyMatrix,
  type Rating,
} from "~/data/mock-competency-data";
import { LevelEditor } from "./_components/level-editor";
import CompetencyAreaEditor from "./_components/competency-area-editor";
import { RatingOptionsEditor } from "./_components/rating-options-editor";
import { mockFunctions } from "~/data/mock-competency-data";

interface LevelMetadata {
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

interface LevelData {
  name: string;
  metadata: LevelMetadata;
}

interface CompetencyMatrixMeta {
  id: string;
  name: string;
  functionId: string;
  published: boolean;
}

const emptyMatrix: CompetencyMatrix = {
  levels: [],
  ratingOptions: [],
  ratingDescriptions: {} as Record<string, string>,
  ratingColors: {} as Record<string, string>,
  ratingLabels: {} as Record<string, string>,
  ratingWeights: {} as Record<string, number>,
  competencies: [],
};

const mockMatrices = [
  {
    id: "1",
    name: "Software Engineering Matrix",
    functionId: "func1",
    published: true,
  },
  {
    id: "2",
    name: "Product Management Matrix",
    functionId: "func2",
    published: false,
  },
  {
    id: "3",
    name: "Design Matrix",
    functionId: "func3",
    published: true,
  },
];

const CompetencyMatrixEditor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("matrixId");

  const [matrix, setMatrix] = useState<CompetencyMatrix>(emptyMatrix);
  const [matrixMeta, setMatrixMeta] = useState<CompetencyMatrixMeta>({
    id: id || "",
    name: "",
    functionId: "",
    published: false,
  });
  const [activeTab, setActiveTab] = useState("levels");

  useEffect(() => {
    if (id) {
      const found = mockMatrices.find((m) => m.id === id);
      if (found) {
        setMatrixMeta({
          id: found.id,
          name: found.name,
          functionId: found.functionId,
          published: found.published,
        });
      }
    }
  }, [id]);

  const handleMetadataChange = (field: string, value: any) => {
    setMatrixMeta((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Updated ${field} to ${value}`);
  };

  const getLevelNames = () => {
    if (matrix.levels.length === 0) return [];
    if (typeof matrix.levels[0] === "string") {
      return matrix.levels as string[];
    } else {
      return (matrix.levels as LevelData[]).map((level) => level.name);
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Competency Matrix Editor</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/competency-matrices")}
        >
          Back to Matrices
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Matrix Information</CardTitle>
          <CardDescription>
            Basic information about this competency matrix
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Matrix Name</Label>
              <p className="text-lg font-medium">{matrixMeta.name}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="function">Function</Label>
              <Select
                value={matrixMeta.functionId}
                onValueChange={(value) =>
                  handleMetadataChange("functionId", value)
                }
              >
                <SelectTrigger id="function" className="w-full">
                  <SelectValue placeholder="Select a function" />
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
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={matrixMeta.published}
              onCheckedChange={(checked) =>
                handleMetadataChange("published", checked)
              }
            />
            <Label htmlFor="published">Published</Label>
            <span className="text-muted-foreground ml-2 text-sm">
              {matrixMeta.published
                ? "Matrix is visible to users"
                : "Matrix is in draft mode and not visible to users"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Matrix Configuration</CardTitle>
          <CardDescription>
            Define the structure and components of your competency matrix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger value="levels">Levels</TabsTrigger>
              <TabsTrigger value="competencies">Competency Areas</TabsTrigger>
              <TabsTrigger value="ratings">Rating Options</TabsTrigger>
            </TabsList>

            <TabsContent value="levels" className="space-y-4">
              <LevelEditor
                levels={matrix.levels}
                onChange={(levels) => setMatrix({ ...matrix, levels })}
              />
            </TabsContent>

            <TabsContent value="competencies" className="space-y-4">
              <CompetencyAreaEditor
                competencies={matrix.competencies}
                levels={getLevelNames()}
                onChange={(competencies) =>
                  setMatrix({ ...matrix, competencies })
                }
              />
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4">
              <RatingOptionsEditor
                ratingOptions={matrix.ratingOptions as string[]}
                ratingDescriptions={matrix.ratingDescriptions}
                ratingColors={matrix.ratingColors}
                ratingLabels={matrix.ratingLabels}
                ratingWeights={matrix.ratingWeights}
                onChange={(ratingData) =>
                  setMatrix({
                    ...matrix,
                    ratingOptions: ratingData.ratingOptions as Rating[],
                    ratingDescriptions: ratingData.ratingDescriptions,
                    ratingColors: ratingData.ratingColors,
                    ratingLabels: ratingData.ratingLabels,
                    ratingWeights: ratingData.ratingWeights,
                  })
                }
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyMatrixEditor;
