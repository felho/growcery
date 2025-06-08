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
import { LevelEditor } from "./_components/level-editor";
import CompetencyAreaEditor from "./_components/competency-area-editor";
import { reorderCompMatrixAreasAction } from "~/server/actions/comp-matrix-area/reorder";
import { useAction } from "next-safe-action/hooks";
import { updateCompMatrixCompetencyAction } from "~/server/actions/comp-matrix-competency/update";
import { RatingOptionsEditor } from "./_components/rating-options-editor";
import {
  fetchCompMatrix,
  updateCompMatrix,
} from "~/lib/client-api/comp-matrix";
import { fetchFunctions } from "~/lib/client-api/functions";
import type { Function } from "~/server/queries/function";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import { reorderLevelsAction } from "~/server/actions/comp-matrix-level/reorder";
import { updateLevelAction } from "~/server/actions/comp-matrix-level/update";
import { createLevelAction } from "~/server/actions/comp-matrix-level/create";
import type { CreateLevelInputFromForm } from "~/zod-schemas/comp-matrix-level";
import { deleteLevelAction } from "~/server/actions/comp-matrix-level/delete";
import { createCompMatrixAreaAction } from "~/server/actions/comp-matrix-area/create";
import { updateCompMatrixAreaAction } from "~/server/actions/comp-matrix-area/update";
import type { CompMatrixAreaEditUI } from "~/server/queries/comp-matrix-area";
import { createCompMatrixCompetencyAction } from "~/server/actions/comp-matrix-competency/create";
import { upsertCompMatrixDefinitionAction } from "~/server/actions/comp-matrix-definition/upsert";
import { deleteCompMatrixCompetencyAction } from "~/server/actions/comp-matrix-competency/delete";
import { deleteCompMatrixAreaAction } from "~/server/actions/comp-matrix-area/delete";
import type {
  CompMatrixRatingOptionUI,
  NewCompMatrixRatingOptionUI,
} from "~/server/queries/comp-matrix-rating-option";
import { createRatingOptionAction } from "~/server/actions/comp-matrix-rating-option/create";
import { deleteRatingOptionAction } from "~/server/actions/comp-matrix-rating-option/delete";
import { updateRatingOptionAction } from "~/server/actions/comp-matrix-rating-option/update";
import { reorderRatingOptionsAction } from "~/server/actions/comp-matrix-rating-option/reorder";
import { reorderCompMatrixCompetenciesAction } from "~/server/actions/comp-matrix-competency/reorder";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";

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
  levelCode: string;
}

const CompetencyMatrixEditor = () => {
  const router = useRouter();
  const params = useParams();
  const matrixId = params.matrixId as string;
  const [matrix, setMatrix] = useState<CompMatrixWithFullRelations | null>(
    null,
  );
  const [functions, setFunctions] = useState<Function[]>([]);
  const [metadata, setMetadata] = useState<MatrixMetadata>({
    title: "",
    functionId: 0,
    isPublished: false,
    levelCode: "L",
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

        const normalizedData = {
          ...matrixData,
          areas: matrixData.areas.map((area) => ({
            ...area,
            competencies: area.competencies || [],
          })),
        };

        setMatrix(normalizedData);
        setFunctions(functionsData);
        setMetadata({
          title: matrixData.title,
          functionId: matrixData.functionId,
          isPublished: matrixData.isPublished,
          levelCode: matrixData.levelCode || "L",
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

  // TODO: This has to be optimized, there is no need to fetch the entire matrix
  // just to add an area. Also, the create area query has to be checked, as now
  // it returns a lot of data that is not needed.
  const createArea = useAction(createCompMatrixAreaAction, {
    onSuccess: async (result) => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, areas: updatedMatrix.areas } : prev,
      );
      toast.success("Area added");
    },
    onError: () => toast.error("Failed to add area"),
  });

  const updateArea = useAction(updateCompMatrixAreaAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, areas: updatedMatrix.areas } : prev,
      );
      toast.success("Area updated");
    },
    onError: () => toast.error("Failed to update area"),
  });

  const handleUpdateArea = (updatedArea: CompMatrixAreaEditUI) => {
    if (!updatedArea.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    updateArea.execute({
      ...updatedArea,
      shortDescription: updatedArea.shortDescription ?? undefined,
    });
  };

  const createCompetency = useAction(createCompMatrixCompetencyAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, areas: updatedMatrix.areas } : prev,
      );
      toast.success("Competency added");
    },
    onError: () => toast.error("Failed to add competency"),
  });

  // TODO: This has to be optimized, there is no need to fetch the entire matrix
  const upsertDefinition = useAction(upsertCompMatrixDefinitionAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, areas: updatedMatrix.areas } : prev,
      );
      toast.success("Definitions saved");
    },
    onError: () => toast.error("Failed to save definitions"),
  });

  const updateCompetency = useAction(updateCompMatrixCompetencyAction);

  const createRatingOption = useAction(createRatingOptionAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, ratingOptions: updatedMatrix.ratingOptions } : prev,
      );
      toast.success("Rating option added");
    },
  });

  const deleteRatingOption = useAction(deleteRatingOptionAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, ratingOptions: updatedMatrix.ratingOptions } : prev,
      );
      toast.success("Rating option deleted");
    },
    onError: () => toast.error("Failed to delete rating option"),
  });

  const handleAddRatingOption = async (input: NewCompMatrixRatingOptionUI) => {
    if (!matrix) return;
    return await createRatingOption.executeAsync({
      ...input,
      competencyMatrixId: matrix.id,
    });
  };

  const handleDeleteRatingOption = async (id: number) => {
    await deleteRatingOption.execute({ id });
  };

  const updateRatingOption = useAction(updateRatingOptionAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, ratingOptions: updatedMatrix.ratingOptions } : prev,
      );
      toast.success("Rating option updated");
    },
    onError: () => toast.error("Failed to update rating option"),
  });

  const handleUpdateRatingOption = async (input: CompMatrixRatingOptionUI) => {
    if (!matrix) return;

    await updateRatingOption.execute({
      ...input,
      competencyMatrixId: matrix.id,
    });
  };

  const reorderRatingOptions = useAction(reorderRatingOptionsAction, {
    onSuccess: async (result) => {
      if (!Array.isArray(result.data?.ratingOptions)) {
        toast.error("Invalid response from server");
        return;
      }
      const updatedRatingOptions = result.data?.ratingOptions;
      setMatrix((prev) => {
        if (!prev) return prev;
        const prevSerialized = JSON.stringify(prev.ratingOptions);
        const nextSerialized = JSON.stringify(updatedRatingOptions);
        if (prevSerialized === nextSerialized) return prev;
        return { ...prev, ratingOptions: updatedRatingOptions };
      });
      toast.success("Rating options reordered successfully");
    },
    onError: (e) => {
      toast.error("Failed to reorder rating options");
      console.error(e);
    },
  });

  const reorderAreas = useAction(reorderCompMatrixAreasAction, {
    onSuccess: async (result) => {
      if (!Array.isArray(result.data?.data)) {
        toast.error("Invalid response from server");
        return;
      }
      const updatedAreas = result.data?.data;
      setMatrix((prev) => {
        if (!prev) return prev;
        const prevSerialized = JSON.stringify(prev.areas);
        const nextSerialized = JSON.stringify(updatedAreas);
        if (prevSerialized === nextSerialized) return prev;
        return { ...prev, areas: updatedAreas };
      });
      toast.success("Competency areas reordered successfully");
    },
    onError: (e) => {
      toast.error("Failed to reorder competency areas");
      console.error(e);
    },
  });

  const handleReorderAreas = (newAreas: { id: number }[]) => {
    if (!matrix) return;

    reorderAreas.execute({
      matrixId: matrix.id,
      areas: newAreas.map((area, index) => ({
        id: area.id,
        sortOrder: index + 1,
      })),
    });
  };

  const reorderCompetencies = useAction(reorderCompMatrixCompetenciesAction, {
    onSuccess: async (result) => {
      if (!Array.isArray(result.data?.competencies)) {
        toast.error("Invalid response from server");
        return;
      }
      const updatedCompetencies = result.data.competencies;
      const areaId = result.data.areaId;

      setMatrix((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          areas: prev.areas.map((area) =>
            area.id === areaId
              ? { ...area, competencies: updatedCompetencies }
              : area,
          ),
        };
      });

      toast.success("Competencies reordered");
    },
    onError: () => toast.error("Failed to reorder competencies"),
  });

  const handleReorderCompetencies = (
    areaId: string,
    items: CompMatrixCompetencyWithDefinitions[],
  ) => {
    if (!matrix) return;
    reorderCompetencies.execute({
      areaId: parseInt(areaId),
      competencies: items.map((item, index) => ({
        id: item.id,
        sortOrder: index + 1,
      })),
    });
  };

  const handleSaveCompetency = async (
    areaId: string,
    data: {
      id?: number;
      name: string;
      levelDefinitions: Record<number, string>;
      skipLevels: number[];
    },
  ) => {
    const { id, name, levelDefinitions, skipLevels } = data;

    let competencyId = id;
    if (!competencyId) {
      const result = await createCompetency.executeAsync({
        compMatrixAreaId: parseInt(areaId),
        title: name,
      });

      competencyId = result?.data?.competency?.id;
      if (!competencyId) {
        toast.error("Failed to create competency");
        return;
      }
    } else {
      await updateCompetency.execute({
        id: competencyId,
        title: name,
      });
    }

    const defs = Object.entries(levelDefinitions).map(
      ([levelIdStr, definition]) => ({
        compMatrixCompetencyId: competencyId!,
        compMatrixLevelId: parseInt(levelIdStr),
        definition,
        inheritsPreviousLevel: skipLevels.includes(parseInt(levelIdStr)),
      }),
    );

    for (const def of defs) {
      try {
        const defResult = await upsertDefinition.executeAsync(def);
        if (!defResult) {
          toast.error("No response from definition save");
          return;
        }
      } catch (err) {
        console.error("Definition save error:", err);
        toast.error("Failed to save one or more definitions");
        return;
      }
    }

    const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
    setMatrix((prev) =>
      prev ? { ...prev, areas: updatedMatrix.areas } : prev,
    );
    toast.success("Competency saved");
  };

  // TODO: Put the handlers after the useActions are defined
  const handleDeleteLevel = (params: { matrixId: number; levelId: number }) => {
    deleteLevel.execute(params);
  };

  const handleAddLevel = (input: CreateLevelInputFromForm) => {
    addLevel.execute({
      ...input,
      matrixId: parseInt(matrixId),
    });
  };

  const handleAddArea = (title: string) => {
    if (!matrix) return;
    createArea.execute({ compMatrixId: matrix.id, title });
  };

  // Delete competency action: destructure .execute as deleteCompetency
  const { execute: deleteCompetency } = useAction(
    deleteCompMatrixCompetencyAction,
    {
      onSuccess: async () => {
        const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
        setMatrix((prev) =>
          prev ? { ...prev, areas: updatedMatrix.areas } : prev,
        );
        toast.success("Competency deleted");
      },
      onError: () => toast.error("Failed to delete competency"),
    },
  );

  // Delete area action
  const deleteArea = useAction(deleteCompMatrixAreaAction, {
    onSuccess: async () => {
      const updatedMatrix = await fetchCompMatrix(parseInt(matrixId));
      setMatrix((prev) =>
        prev ? { ...prev, areas: updatedMatrix.areas } : prev,
      );
      toast.success("Area deleted");
    },
    onError: () => toast.error("Failed to delete area"),
  });

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
          onClick={() => router.push("/admin/comp-matrix-editor")}
          className="cursor-pointer"
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
              <Button onClick={handleSaveMetadata} className="cursor-pointer">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditingMeta(true)}
                className="cursor-pointer"
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="levelCode">Level Code</Label>
              {isEditingMeta ? (
                <Input
                  id="levelCode"
                  value={metadata.levelCode}
                  onChange={(e) =>
                    handleMetadataChange("levelCode", e.target.value)
                  }
                  maxLength={10}
                  placeholder="pl. L"
                />
              ) : (
                <p className="text-lg font-medium">{matrix.levelCode || "L"}</p>
              )}
              <p className="text-muted-foreground text-sm">
                Prefix for levels in the matrix (e.g. L1, L2, etc.)
              </p>
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
                  className="cursor-pointer"
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
                areas={matrix.areas}
                levels={matrix.levels}
                onChange={(areas) => {
                  // TODO: implement persistence
                  setMatrix((prev) => (prev ? { ...prev, areas } : null));
                }}
                onAddArea={handleAddArea}
                onUpdateArea={handleUpdateArea}
                onSaveCompetency={handleSaveCompetency}
                onDeleteCompetency={(areaId, competencyId) => {
                  deleteCompetency({
                    id: parseInt(competencyId),
                  });
                }}
                onDeleteArea={(areaId) => {
                  deleteArea.execute({ id: parseInt(areaId) });
                }}
                onReorderAreas={handleReorderAreas}
                onReorderCompetencies={handleReorderCompetencies}
              />
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4">
              <RatingOptionsEditor
                ratingOptions={matrix.ratingOptions}
                onChange={(ratingData) => {
                  setMatrix((prev) =>
                    prev
                      ? {
                          ...prev,
                          ratingOptions: ratingData,
                        }
                      : null,
                  );
                }}
                onAdd={handleAddRatingOption}
                onDelete={handleDeleteRatingOption}
                onUpdate={handleUpdateRatingOption}
                onReorder={(reordered) => {
                  reorderRatingOptions.execute({
                    matrixId: matrix.id,
                    ratingOptions: reordered.map(({ id, sortOrder }) => ({
                      id,
                      sortOrder,
                    })),
                  });
                  setMatrix((prev) =>
                    prev
                      ? {
                          ...prev,
                          ratingOptions: reordered.map(
                            ({
                              id,
                              title,
                              radioButtonLabel,
                              definition,
                              calculationWeight,
                              color,
                            }) => ({
                              id,
                              title,
                              competencyMatrixId: matrix.id,
                              radioButtonLabel,
                              definition,
                              calculationWeight,
                              color,
                            }),
                          ),
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
