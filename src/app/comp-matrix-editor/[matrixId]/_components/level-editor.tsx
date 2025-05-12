"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import type { DragEndEvent as DragEndEventCore } from "@dnd-kit/core";
import { LevelCard } from "./level-card";

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
}

interface NewLevelFormValues {
  name: string;
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

export const LevelEditor = ({
  matrixId,
  levels,
  onChange,
}: LevelEditorProps) => {
  const [showNewLevelForm, setShowNewLevelForm] = useState(false);
  const [insertPosition, setInsertPosition] = useState(-1);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>(
    {},
  );

  const [localLevels, setLocalLevels] = useState<LevelData[]>(levels);
  useEffect(() => {
    setLocalLevels(levels);
  }, [levels]);

  const form = useForm<NewLevelFormValues>({
    defaultValues: {
      name: "",
      title: "",
      description: "",
      persona: "",
      areaOfImpact: "",
    },
  });

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

  const handleAddLevel = (data: NewLevelFormValues) => {
    if (!data.name.trim()) return;

    const newLevelData: LevelData = {
      id: Date.now(),
      name: data.name,
      metadata: {
        title: data.title,
        description: data.description,
        persona: data.persona,
        areaOfImpact: data.areaOfImpact,
      },
    };

    const updatedLevels = [...levels];
    if (insertPosition >= 0) {
      updatedLevels.splice(insertPosition, 0, newLevelData);
      setInsertPosition(-1);
    } else {
      updatedLevels.push(newLevelData);
    }

    onChange(updatedLevels);
    form.reset();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold">Experience Levels</h3>
        <p className="text-muted-foreground text-sm">
          Define the experience levels for your competency matrix
        </p>
      </div>

      <Collapsible
        open={showNewLevelForm}
        onOpenChange={setShowNewLevelForm}
        className="mb-4 rounded-md border"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant={showNewLevelForm ? "outline" : "default"}
            className="flex w-full justify-between"
          >
            <span>
              {insertPosition >= 0
                ? `Insert New Level at Position ${insertPosition + 1}`
                : "Add New Level"}
            </span>
            {showNewLevelForm ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddLevel)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level Name*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          placeholder="e.g. Junior, Engineer (E1)"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          placeholder="Short descriptive title"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          required
                          rows={3}
                          placeholder="Detailed description"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    name="persona"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Persona*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder="Target persona"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="areaOfImpact"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area of Impact*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder="Scope of influence"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowNewLevelForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  {insertPosition >= 0 ? "Insert Level" : "Add Level"}
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>

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
                  onRemove={handleRemoveLevel}
                  onMove={handleMoveLevel}
                  onToggleExpand={toggleExpand}
                  onUpdateMetadata={updateMetadata}
                  isExpanded={expandedLevels[index] ?? false}
                  onInsertBefore={() => {
                    setInsertPosition(index);
                    setShowNewLevelForm(true);
                    form.reset();
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
