"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LevelCard } from "./level-card";
import { NewLevelForm } from "./new-level-form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { type CreateLevelInputFromForm } from "~/zod-schemas/comp-matrix-levels";

interface LevelMetadata {
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

interface LevelData {
  id: number;
  name: string;
  metadata: LevelMetadata;
}

interface LevelEditorProps {
  matrixId: number;
  levels: LevelData[];
  onChange: (levels: LevelData[]) => void;
  onUpdateLevel: (params: {
    levelId: number;
    title: string;
    description: string;
    persona: string;
    areaOfImpact: string;
  }) => void;
  onAddLevel: (input: CreateLevelInputFromForm) => void;
  onDeleteLevel: (params: { matrixId: number; levelId: number }) => void;
}

interface NewLevelFormValues {
  name: string;
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

export const LevelEditor = ({
  matrixId: propMatrixId,
  levels,
  onChange,
  onUpdateLevel,
  onAddLevel,
  onDeleteLevel,
}: LevelEditorProps) => {
  const params = useParams();
  const matrixId = Number(params.matrixId);

  const [showNewLevelForm, setShowNewLevelForm] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number | undefined>();
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>(
    {},
  );

  const [localLevels, setLocalLevels] = useState<LevelData[]>(levels);
  useEffect(() => {
    setLocalLevels(levels);
  }, [levels]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const optimisticReorder = (updated: LevelData[]) => {
    setLocalLevels(updated);
    onChange(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localLevels.findIndex((l) => l.id === Number(active.id));
    const newIndex = localLevels.findIndex((l) => l.id === Number(over.id));

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedLevels = [...localLevels];
      const [moved] = updatedLevels.splice(oldIndex, 1);
      if (moved) {
        updatedLevels.splice(newIndex, 0, moved);
        optimisticReorder(updatedLevels);
      }
    }
  };

  const handleMoveLevel = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === localLevels.length - 1)
    )
      return;

    const updatedLevels = [...localLevels];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const sourceLevel = updatedLevels[index];
    const targetLevel = updatedLevels[targetIndex];
    if (sourceLevel && targetLevel) {
      [updatedLevels[index], updatedLevels[targetIndex]] = [
        targetLevel,
        sourceLevel,
      ];
    }

    optimisticReorder(updatedLevels);
  };

  const handleAddLevel = (data: CreateLevelInputFromForm) => {
    onAddLevel({
      ...data,
      insertPosition,
    });
    setInsertPosition(undefined);
    setShowNewLevelForm(false);
  };

  const handleRemoveLevel = (index: number) => {
    const updatedLevels = [...levels];
    updatedLevels.splice(index, 1);
    onChange(updatedLevels);
  };

  const toggleExpand = (index: number) => {
    setExpandedLevels((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const updateMetadata = (
    index: number,
    field: keyof LevelMetadata,
    value: string,
  ) => {
    const updatedLevels = [...levels];
    const level = updatedLevels[index];
    if (level) {
      updatedLevels[index] = {
        ...level,
        metadata: { ...level.metadata, [field]: value },
      };
      onChange(updatedLevels);
    }
  };

  const handleSaveLevel = async (index: number, metadata: LevelMetadata) => {
    const level = levels[index];
    if (!level) return;

    await onUpdateLevel({
      levelId: level.id,
      title: metadata.title,
      description: metadata.description,
      persona: metadata.persona,
      areaOfImpact: metadata.areaOfImpact,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold">Experience Levels</h3>
        <p className="text-muted-foreground text-sm">
          Define the experience levels for your competency matrix
        </p>
      </div>

      <NewLevelForm
        showForm={showNewLevelForm}
        onShowFormChange={setShowNewLevelForm}
        onSubmit={handleAddLevel}
        insertPosition={insertPosition}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localLevels.map((l) => String(l.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {localLevels.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No levels defined yet. Add your first level above.
              </p>
            ) : (
              localLevels.map((level, index) => (
                <LevelCard
                  key={level.id}
                  level={level}
                  index={index}
                  onMove={handleMoveLevel}
                  onToggleExpand={toggleExpand}
                  onUpdateMetadata={updateMetadata}
                  onSave={handleSaveLevel}
                  onRemove={(i) =>
                    onDeleteLevel({ matrixId, levelId: level.id })
                  }
                  isExpanded={expandedLevels[index] ?? false}
                  onInsertBefore={() => {
                    setInsertPosition(index);
                    setShowNewLevelForm(true);
                  }}
                  levelsLength={localLevels.length}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
