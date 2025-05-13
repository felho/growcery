"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Input } from "~/components/ui/input";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import {
  type CompetencyMatrix,
  type Rating,
} from "~/data/mock-competency-data";
import { LevelEditor } from "./_components/level-editor";
import CompetencyAreaEditor from "./_components/competency-area-editor";
import { RatingOptionsEditor } from "./_components/rating-options-editor";
import { mockFunctions } from "~/data/mock-competency-data";
import {
  fetchCompMatrix,
  updateCompMatrix,
} from "~/lib/client-api/comp-matrix";
import type { CompMatrix } from "~/server/queries/comp-matrix";
import { fetchFunctions } from "~/lib/client-api/functions";
import type { Function } from "~/server/queries/function";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import { reorderLevelsAction } from "~/server/actions/comp-matrix-levels/reorder";
import { updateLevelAction } from "~/server/actions/comp-matrix-levels/update";
import { createLevelAction } from "~/server/actions/comp-matrix-levels/create";
import { useAction } from "next-safe-action/hooks";
import type { CreateLevelInputFromForm } from "~/zod-schemas/comp-matrix-levels";
import { deleteLevelAction } from "~/server/actions/comp-matrix-levels/delete";

// Temporary type that combines DB and mock data
type HybridMatrix = CompMatrixWithFullRelations & {
  competencies: CompetencyMatrix["competencies"];
  ratingOptions: string[];
  ratingDescriptions: Record<string, string>;
  ratingColors: Record<string, string>;
  ratingLabels: Record<string, string>;
  ratingWeights: Record<string, number>;
};

interface LevelMetadata {
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

interface LevelData {
  id: number;
  name: string;
  metadata: {
    title: string;
    description: string;
    persona: string;
    areaOfImpact: string;
  };
}

interface MatrixMetadata {
  title: string;
  functionId: number;
  isPublished: boolean;
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

const CompetencyMatrixEditor = () => {
  const router = useRouter();
  const params = useParams();
  const matrixId = params.matrixId as string;
  const [matrix, setMatrix] = useState<HybridMatrix | null>(null);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [metadata, setMetadata] = useState<MatrixMetadata>({
    title: "",
    functionId: 0,
    isPublished: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("levels");
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempFunctionId, setTempFunctionId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [matrixData, functionsData] = await Promise.all([
          fetchCompMatrix(parseInt(matrixId)),
          fetchFunctions(),
        ]);

        // Combine DB data with mock data
        const hybridMatrix: HybridMatrix = {
          ...matrixData,
          competencies: emptyMatrix.competencies,
          ratingOptions: emptyMatrix.ratingOptions,
          ratingDescriptions: emptyMatrix.ratingDescriptions,
          ratingColors: emptyMatrix.ratingColors,
          ratingLabels: emptyMatrix.ratingLabels,
          ratingWeights: emptyMatrix.ratingWeights,
        };

        setMatrix(hybridMatrix);
        setFunctions(functionsData);
        setMetadata({
          title: matrixData.title,
          functionId: matrixData.functionId,
          isPublished: matrixData.isPublished,
        });
        setTempName(matrixData.title);
        setTempFunctionId(matrixData.functionId.toString());
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load matrix data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [matrixId]);

  const reorder = useAction(reorderLevelsAction, {
    onSuccess: (result) => {
      console.log("Reorder result:", result);
      if (!Array.isArray(result.data?.levels)) {
        toast.error("Invalid response from server");
        return;
      }

      const updatedLevels = result.data?.levels;

      setMatrix((prev) => {
        if (!prev) return prev;

        const prevSerialized = JSON.stringify(prev.levels);
        const nextSerialized = JSON.stringify(updatedLevels);
        if (prevSerialized === nextSerialized) return prev;

        return { ...prev, levels: updatedLevels };
      });

      toast.success("Levels reordered successfully");
    },
    onError: (e) => {
      toast.error("Failed to reorder levels");
      console.error(e);
    },
  });

  const updateLevel = useAction(updateLevelAction, {
    onSuccess: (result) => {
      if (!result.data?.level) {
        toast.error("Invalid response from server");
        return;
      }

      setMatrix((prev) => {
        if (!prev) return prev;
        const updatedLevels = prev.levels.map((level) =>
          level.id === result.data?.level.id ? result.data?.level : level,
        );
        return { ...prev, levels: updatedLevels };
      });

      toast.success("Level updated successfully");
    },
    onError: (e) => {
      toast.error("Failed to update level");
      console.error(e);
    },
  });

  const addLevel = useAction(createLevelAction, {
    onSuccess: async (result) => {
      const level = result.data?.level;
      if (!level) return;

      toast.success("Level created");

      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) => ({
        ...prev!,
        levels: updatedMatrix.levels,
      }));
    },
    onError: () => toast.error("Failed to create level"),
  });

  const deleteLevel = useAction(deleteLevelAction, {
    onSuccess: async (result) => {
      toast.success("Level deleted");
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, levels: updatedMatrix.levels } : prev,
      );
    },
    onError: () => toast.error("Failed to delete level"),
  });

  const handleDeleteLevel = (params: { matrixId: number; levelId: number }) => {
    deleteLevel.execute(params);
  };

  const handleAddLevel = (input: CreateLevelInputFromForm) => {
    addLevel.execute({
      ...input,
      matrixId: parseInt(matrixId),
    });
  };

  const handleMetadataChange = (
    field: keyof MatrixMetadata,
    value: string | number | boolean,
  ) => {
    console.log("Changing metadata:", field, value, typeof value); // Debug log
    setMetadata((prev) => ({
      ...prev,
      [field]: field === "functionId" ? Number(value) : value,
    }));
  };

  const handleSaveMetadata = async () => {
    if (!matrix) return;

    setIsSaving(true);
    try {
      const dataToSave = {
        ...metadata,
        functionId: Number(metadata.functionId),
      };
      const updatedMatrix = await updateCompMatrix(matrix.id, dataToSave);
      setMatrix({
        ...matrix,
        ...updatedMatrix,
      });
      toast.success("Matrix metadata updated successfully");
      setIsEditingMeta(false); // Switch back to static view
    } catch (error) {
      console.error("Error saving metadata:", error);
      toast.error("Failed to save matrix metadata");
    } finally {
      setIsSaving(false);
    }
  };

  const getLevelNames = () => {
    if (!matrix) return [];
    if (matrix.levels.length === 0) return [];
    return matrix.levels.map((level) => level.jobTitle);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!matrix) {
    return <div>Matrix not found</div>;
  }

  const handleReorderLevels = (newLevels: LevelData[]) => {
    reorder.execute({
      matrixId: matrix.id,
      levels: newLevels.map((level, index) => ({
        id: level.id,
        numericLevel: index + 1,
      })),
    });
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Competency Matrix Editor</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/comp-matrix-editor")}
        >
          Back to Matrices
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Matrix Information</CardTitle>
            <CardDescription>
              Basic information about this competency matrix
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditingMeta ? (
              <Button onClick={handleSaveMetadata}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditingMeta(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Matrix Name</Label>
              {isEditingMeta ? (
                <Input
                  id="name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
              ) : (
                <p className="text-lg font-medium">{matrix.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="function">Function</Label>
              {isEditingMeta ? (
                <Select
                  value={String(metadata.functionId)}
                  onValueChange={(val) =>
                    handleMetadataChange("functionId", Number(val))
                  }
                >
                  <SelectTrigger id="function" className="w-full">
                    <SelectValue placeholder="Select a function" />
                  </SelectTrigger>
                  <SelectContent>
                    {functions.map((func) => (
                      <SelectItem key={func.id} value={String(func.id)}>
                        {func.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-lg font-medium">
                  {functions.find((f) => f.id === metadata.functionId)?.name ||
                    "N/A"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditingMeta ? (
              <>
                <Switch
                  id="published"
                  checked={metadata.isPublished}
                  onCheckedChange={(checked) =>
                    handleMetadataChange("isPublished", checked)
                  }
                />
                <Label htmlFor="published">Published</Label>
                <span className="text-muted-foreground ml-2 text-sm">
                  {metadata.isPublished
                    ? "Matrix is visible to users"
                    : "Matrix is in draft mode and not visible to users"}
                </span>
              </>
            ) : (
              <span
                className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  matrix.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {matrix.isPublished ? "Published" : "Draft"}
              </span>
            )}
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
                matrixId={matrix.id}
                levels={matrix.levels.map((level) => ({
                  id: level.id,
                  name: level.jobTitle,
                  metadata: {
                    title: level.jobTitle,
                    description: level.roleSummary,
                    persona: level.persona || "",
                    areaOfImpact: level.areaOfImpact || "",
                  },
                }))}
                onChange={handleReorderLevels}
                onUpdateLevel={updateLevel.execute}
                onAddLevel={handleAddLevel}
                onDeleteLevel={handleDeleteLevel}
              />
            </TabsContent>

            <TabsContent value="competencies" className="space-y-4">
              <CompetencyAreaEditor
                competencies={matrix.competencies}
                levels={getLevelNames()}
                onChange={(competencies) => {
                  setMatrix((prev) =>
                    prev ? { ...prev, competencies } : null,
                  );
                }}
              />
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4">
              <RatingOptionsEditor
                ratingOptions={matrix.ratingOptions}
                ratingDescriptions={matrix.ratingDescriptions}
                ratingColors={matrix.ratingColors}
                ratingLabels={matrix.ratingLabels}
                ratingWeights={matrix.ratingWeights}
                onChange={(ratingData) => {
                  setMatrix((prev) =>
                    prev
                      ? {
                          ...prev,
                          ratingOptions: ratingData.ratingOptions,
                          ratingDescriptions: ratingData.ratingDescriptions,
                          ratingColors: ratingData.ratingColors,
                          ratingLabels: ratingData.ratingLabels,
                          ratingWeights: ratingData.ratingWeights,
                        }
                      : null,
                  );
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyMatrixEditor;
