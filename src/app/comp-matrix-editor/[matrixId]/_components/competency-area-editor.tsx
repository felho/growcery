"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Plus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  CompetencyCategory,
  CompetencyItem,
} from "~/data/mock-competency-data";
import CompetencyArea from "./competency-area";

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = competencies.findIndex((c) => c.id === active.id);
    const newIndex = competencies.findIndex((c) => c.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(competencies, oldIndex, newIndex));
    }
  };

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
    const category = updatedCategories[categoryIndex]!;

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

  const handleReorderItems = (categoryId: string, items: CompetencyItem[]) => {
    onChange(
      competencies.map((category) =>
        category.id === categoryId ? { ...category, items } : category,
      ),
    );
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={competencies.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {competencies.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No competency areas defined yet. Add your first area above.
              </p>
            ) : (
              competencies.map((category) => (
                <SortableCompetencyArea
                  key={category.id}
                  category={category}
                  onUpdateName={handleUpdateCategoryName}
                  onRemove={handleRemoveCategory}
                  onAddCompetency={openCompetencyDialog}
                  onEditCompetency={openCompetencyDialog}
                  onRemoveCompetency={handleRemoveCompetency}
                  isOpen={openAreaId === category.id}
                  onOpenChange={(open) =>
                    setOpenAreaId(open ? category.id : null)
                  }
                  onReorderItems={handleReorderItems}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

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

interface SortableCompetencyAreaProps {
  category: CompetencyCategory;
  onUpdateName: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onAddCompetency: (areaId: string) => void;
  onEditCompetency: (areaId: string, competency: CompetencyItem) => void;
  onRemoveCompetency: (areaId: string, competencyId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReorderItems: (categoryId: string, items: CompetencyItem[]) => void;
}

const SortableCompetencyArea: React.FC<SortableCompetencyAreaProps> = (
  props,
) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CompetencyArea
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

export default CompetencyAreaEditor;
