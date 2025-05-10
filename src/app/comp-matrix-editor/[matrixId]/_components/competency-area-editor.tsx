"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Edit,
  GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import type {
  CompetencyCategory,
  CompetencyItem,
} from "~/data/mock-competency-data";

interface CompetencyAreaEditorProps {
  competencies: CompetencyCategory[];
  levels: string[];
  onChange: (competencies: CompetencyCategory[]) => void;
}

const CompetencyAreaEditor: React.FC<CompetencyAreaEditorProps> = ({
  competencies,
  levels,
  onChange,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [openAreaId, setOpenAreaId] = useState<string | null>(null);
  const [isAddingCompetency, setIsAddingCompetency] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<{
    areaId: string;
    competency: CompetencyItem | null;
  } | null>(null);

  const [competencyForm, setCompetencyForm] = useState({
    name: "",
    definition: "",
    levelDefinitions: {} as Record<string, string>,
    skipLevels: [] as string[],
  });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onChange([
      ...competencies,
      { id: uuidv4(), category: newCategoryName, items: [] },
    ]);
    setNewCategoryName("");
  };

  const handleRemoveCategory = (id: string) => {
    onChange(competencies.filter((c) => c.id !== id));
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    onChange(
      competencies.map((c) => (c.id === id ? { ...c, category: name } : c)),
    );
  };

  const openCompetencyDialog = (
    areaId: string,
    competency: CompetencyItem | null = null,
  ) => {
    if (competency) {
      setCompetencyForm({
        name: competency.name,
        definition: competency.definition || "",
        levelDefinitions: competency.levelDefinitions || {},
        skipLevels: Object.keys(competency.levelDefinitions || {}).filter(
          (level) => competency.levelDefinitions?.[level] === "N/A",
        ),
      });
      setEditingCompetency({ areaId, competency });
    } else {
      setCompetencyForm({
        name: "",
        definition: "",
        levelDefinitions: {},
        skipLevels: [],
      });
      setEditingCompetency({ areaId, competency: null });
    }
    setIsAddingCompetency(true);
  };

  const handleSaveCompetency = () => {
    if (!editingCompetency || !competencyForm.name.trim()) return;
    const { areaId, competency } = editingCompetency;

    const categoryIndex = competencies.findIndex((c) => c.id === areaId);
    if (categoryIndex === -1) return;

    const levelDefinitions: Record<string, string> = {};
    levels.forEach((level) => {
      levelDefinitions[level] = competencyForm.skipLevels.includes(level)
        ? "N/A"
        : competencyForm.levelDefinitions[level] || "";
    });

    const updatedCompetency: CompetencyItem = {
      id: competency?.id || uuidv4(),
      name: competencyForm.name,
      definition: competencyForm.definition,
      levelDefinitions,
      employeeRating: "Novice",
      managerRating: "Novice",
      employeeNote: "",
      managerNote: "",
    };

    const updatedCategories = [...competencies];
    const category = updatedCategories[categoryIndex]!; // biztosan létezik

    const updatedItems = competency
      ? category.items.map((item) =>
          item.id === competency.id ? updatedCompetency : item,
        )
      : [...category.items, updatedCompetency];

    updatedCategories[categoryIndex] = {
      ...category,
      items: updatedItems,
    };

    onChange(updatedCategories);
    setIsAddingCompetency(false);
    setEditingCompetency(null);
  };

  const handleRemoveCompetency = (areaId: string, competencyId: string) => {
    onChange(
      competencies.map((category) =>
        category.id === areaId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== competencyId),
            }
          : category,
      ),
    );
  };

  const toggleLevelSkip = (level: string) => {
    const skipLevels = competencyForm.skipLevels.includes(level)
      ? competencyForm.skipLevels.filter((l) => l !== level)
      : [...competencyForm.skipLevels, level];
    setCompetencyForm({ ...competencyForm, skipLevels });
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return;
    }

    const areaId = source.droppableId;
    const categoryIndex = competencies.findIndex((c) => c.id === areaId);
    if (categoryIndex === -1) return;

    const updatedCategories = [...competencies];
    const category = updatedCategories[categoryIndex]!;
    const updatedItems = [...category.items];

    const [moved] = updatedItems.splice(source.index, 1);
    if (!moved) return;

    updatedItems.splice(destination.index, 0, moved);

    updatedCategories[categoryIndex] = {
      ...category,
      items: updatedItems,
    };

    onChange(updatedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold">Competency Areas</h3>
        <p className="text-muted-foreground text-sm">
          Define the competency areas and individual competencies
        </p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Add new competency area (e.g. Technical Skills)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddCategory} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Add Area
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          {competencies.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No competency areas defined yet. Add your first area above.
            </p>
          ) : (
            competencies.map((category) => (
              <Collapsible
                key={category.id}
                open={openAreaId === category.id}
                onOpenChange={() =>
                  setOpenAreaId(openAreaId === category.id ? null : category.id)
                }
                className="rounded-md border"
              >
                <div className="bg-muted/50 flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="text-muted-foreground h-5 w-5" />
                    <Input
                      value={category.category}
                      onChange={(e) =>
                        handleUpdateCategoryName(category.id, e.target.value)
                      }
                      className="h-auto border-none bg-transparent p-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {openAreaId === category.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveCategory(category.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent className="space-y-4 border-t p-4">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => openCompetencyDialog(category.id)}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Competency
                    </Button>
                  </div>

                  {category.items.length === 0 ? (
                    <p className="text-muted-foreground py-2 text-center">
                      No competencies in this area yet.
                    </p>
                  ) : (
                    <Droppable droppableId={category.id} type="competency">
                      {(provided) => (
                        <div
                          className="space-y-2"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {category.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                                >
                                  <Card className="border-border">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
                                        </div>
                                        <CardTitle className="text-base">
                                          {item.name}
                                        </CardTitle>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            openCompetencyDialog(
                                              category.id,
                                              item,
                                            )
                                          }
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() =>
                                            handleRemoveCompetency(
                                              category.id,
                                              item.id,
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="px-4 py-2">
                                      <p className="text-muted-foreground text-sm">
                                        {item.definition ||
                                          "No definition provided"}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </DragDropContext>

      {/* Dialog for adding/editing competencies */}
      <Dialog open={isAddingCompetency} onOpenChange={setIsAddingCompetency}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCompetency?.competency
                ? "Edit Competency"
                : "Add New Competency"}
            </DialogTitle>
            <DialogDescription>
              Define the competency and its level-specific requirements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="competency-name">Competency Name</Label>
                <Input
                  id="competency-name"
                  placeholder="e.g. Problem Solving"
                  value={competencyForm.name}
                  onChange={(e) =>
                    setCompetencyForm({
                      ...competencyForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competency-definition">
                  General Definition
                </Label>
                <Textarea
                  id="competency-definition"
                  placeholder="Describe what this competency means in general"
                  value={competencyForm.definition}
                  onChange={(e) =>
                    setCompetencyForm({
                      ...competencyForm,
                      definition: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Level-Specific Definitions</h4>
              {levels.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No levels defined yet. Please define levels first.
                </p>
              ) : (
                levels.map((level, i) => (
                  <div key={level} className="space-y-2 rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <Label
                        htmlFor={`level-def-${i}`}
                        className="text-base font-medium"
                      >
                        {level}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`skip-level-${i}`}
                          checked={competencyForm.skipLevels.includes(level)}
                          onCheckedChange={() => toggleLevelSkip(level)}
                        />
                        <Label htmlFor={`skip-level-${i}`} className="text-sm">
                          No specific requirements
                        </Label>
                      </div>
                    </div>

                    {!competencyForm.skipLevels.includes(level) && (
                      <Textarea
                        id={`level-def-${i}`}
                        placeholder={`Define requirements for ${level}`}
                        disabled={competencyForm.skipLevels.includes(level)}
                        value={competencyForm.levelDefinitions[level] || ""}
                        onChange={(e) => {
                          const updatedDefinitions = {
                            ...competencyForm.levelDefinitions,
                            [level]: e.target.value,
                          };
                          setCompetencyForm({
                            ...competencyForm,
                            levelDefinitions: updatedDefinitions,
                          });
                        }}
                      />
                    )}

                    {competencyForm.skipLevels.includes(level) && (
                      <p className="text-muted-foreground text-sm italic">
                        No new requirements for this level
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingCompetency(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCompetency}>
              <Check className="mr-2 h-4 w-4" />
              Save Competency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetencyAreaEditor;
