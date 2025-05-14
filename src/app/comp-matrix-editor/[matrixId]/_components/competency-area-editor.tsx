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
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import type {
//   CompetencyCategory,
//   CompetencyItem,
// } from "~/data/mock-competency-data";
import type {
  CompMatrixAreaEditUI,
  CompMatrixAreaWithFullRelations,
} from "~/server/queries/comp-matrix-area";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";
import CompetencyArea from "./competency-area";
import type { CompMatrixLevel } from "~/server/queries/comp-matrix-level";

interface CompetencyAreaEditorProps {
  areas: CompMatrixAreaWithFullRelations[];
  levels: CompMatrixLevel[];
  onChange: (areas: CompMatrixAreaWithFullRelations[]) => void;
  onAddArea: (title: string) => void;
  onUpdateArea: (updatedArea: CompMatrixAreaEditUI) => void;
  onSaveCompetency: (
    areaId: string,
    competency: {
      id?: number;
      name: string;
      levelDefinitions: Record<number, string>;
      skipLevels: number[];
    },
  ) => void;
}

const CompetencyAreaEditor: React.FC<CompetencyAreaEditorProps> = ({
  areas,
  levels,
  onChange,
  onAddArea,
  onUpdateArea,
  onSaveCompetency,
}) => {
  const [newAreaName, setNewAreaName] = useState("");
  const [openAreaId, setOpenAreaId] = useState<string | null>(null);
  const [isAddingCompetency, setIsAddingCompetency] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<{
    areaId: string;
    competency: CompMatrixCompetencyWithDefinitions | null;
  } | null>(null);

  const [competencyForm, setCompetencyForm] = useState({
    name: "",
    definition: "",
    levelDefinitions: {} as Record<number, string>,
    skipLevels: [] as number[],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = areas.findIndex((a) => a.id === active.id);
    const newIndex = areas.findIndex((a) => a.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(areas, oldIndex, newIndex));
    }
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) return;
    onAddArea(newAreaName.trim());
    setNewAreaName("");
  };

  const handleRemoveArea = (id: string) => {
    onChange(areas.filter((a) => a.id !== parseInt(id)));
  };

  const handleUpdateArea = (updatedArea: CompMatrixAreaEditUI) => {
    onUpdateArea(updatedArea);
  };

  const openCompetencyDialog = (
    areaId: string,
    competency: CompMatrixCompetencyWithDefinitions | null = null,
  ) => {
    if (competency) {
      setCompetencyForm({
        name: competency.title,
        definition: competency.definitions[0]?.definition || "",
        levelDefinitions: Object.fromEntries(
          (competency.definitions || []).map((d) => [
            d.compMatrixLevelId,
            d.definition,
          ]),
        ),
        skipLevels: (competency.definitions || [])
          .filter((d) => !d.definition?.trim())
          .map((d) => d.compMatrixLevelId),
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
    onSaveCompetency(areaId, {
      id: competency?.id,
      name: competencyForm.name,
      levelDefinitions: competencyForm.levelDefinitions,
      skipLevels: competencyForm.skipLevels,
    });
    // Clear the competency form state after saving
    setCompetencyForm({
      name: "",
      definition: "",
      levelDefinitions: {},
      skipLevels: [],
    });
    setIsAddingCompetency(false);
    setEditingCompetency(null);
  };

  const handleRemoveCompetency = (areaId: string, competencyId: string) => {
    onChange(
      areas.map((area) =>
        area.id === parseInt(areaId)
          ? {
              ...area,
              competencies: area.competencies.filter(
                (item) => item.id !== parseInt(competencyId),
              ),
            }
          : area,
      ),
    );
  };

  // Level skip/definitions logic omitted for DB type (could be added if needed)
  // const toggleLevelSkip = (level: string) => { ... };

  const handleReorderItems = (
    areaId: string,
    items: CompMatrixCompetencyWithDefinitions[],
  ) => {
    onChange(
      areas.map((area) =>
        area.id === parseInt(areaId) ? { ...area, competencies: items } : area,
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
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddArea} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Add Area
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={areas.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {areas.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No competency areas defined yet. Add your first area above.
              </p>
            ) : (
              areas.map((area) => (
                <SortableCompetencyArea
                  key={area.id}
                  category={area}
                  onUpdateArea={handleUpdateArea}
                  onRemove={handleRemoveArea}
                  onAddCompetency={openCompetencyDialog}
                  onEditCompetency={openCompetencyDialog}
                  onRemoveCompetency={handleRemoveCompetency}
                  isOpen={openAreaId === area.id.toString()}
                  onOpenChange={(open) =>
                    setOpenAreaId(open ? area.id.toString() : null)
                  }
                  onReorderItems={handleReorderItems}
                  onSaveCompetency={handleSaveCompetency}
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
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Level-Specific Definitions</h4>
              {levels.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No levels defined yet. Please define levels first.
                </p>
              ) : (
                levels.map((level, i) => (
                  <div
                    key={level.id}
                    className="space-y-2 rounded-md border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <Label
                        htmlFor={`level-def-${i}`}
                        className="text-base font-medium"
                      >
                        {level.jobTitle}
                      </Label>
                      <div className="flex items-center space-x-2 rounded-md p-2">
                        <Checkbox
                          className="!bg-muted"
                          id={`skip-level-${i}`}
                          checked={competencyForm.skipLevels.includes(level.id)}
                          onCheckedChange={() => {
                            const isSkipping =
                              competencyForm.skipLevels.includes(level.id);
                            setCompetencyForm((prev) => ({
                              ...prev,
                              skipLevels: isSkipping
                                ? prev.skipLevels.filter(
                                    (id) => id !== level.id,
                                  )
                                : [...prev.skipLevels, level.id],
                            }));
                          }}
                        />
                        <Label htmlFor={`skip-level-${i}`} className="text-sm">
                          No specific requirements
                        </Label>
                      </div>
                    </div>

                    {!competencyForm.skipLevels.includes(level.id) && (
                      <Textarea
                        id={`level-def-${i}`}
                        placeholder={`Define requirements for ${level.jobTitle}`}
                        value={competencyForm.levelDefinitions[level.id] || ""}
                        onChange={(e) => {
                          const updatedDefinitions = {
                            ...competencyForm.levelDefinitions,
                            [level.id]: e.target.value,
                          };
                          setCompetencyForm((prev) => ({
                            ...prev,
                            levelDefinitions: updatedDefinitions,
                          }));
                        }}
                      />
                    )}

                    {competencyForm.skipLevels.includes(level.id) && (
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
  category: CompMatrixAreaWithFullRelations;
  onUpdateArea: (updatedArea: CompMatrixAreaEditUI) => void;
  onRemove: (id: string) => void;
  onAddCompetency: (areaId: string) => void;
  onEditCompetency: (
    areaId: string,
    competency: CompMatrixCompetencyWithDefinitions,
  ) => void;
  onRemoveCompetency: (areaId: string, competencyId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReorderItems: (
    categoryId: string,
    items: CompMatrixCompetencyWithDefinitions[],
  ) => void;
  onSaveCompetency: (
    areaId: string,
    competency: {
      id?: number;
      name: string;
      levelDefinitions: Record<number, string>;
      skipLevels: number[];
    },
  ) => void;
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
