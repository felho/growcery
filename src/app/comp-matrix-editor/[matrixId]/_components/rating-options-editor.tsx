"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Plus, X, CircleCheck, GripVertical } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
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
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";

interface RatingOptionsEditorProps {
  ratingOptions: CompMatrixRatingOption[];
  onChange: (updatedRatingOptions: CompMatrixRatingOption[]) => void;
}

export const RatingOptionsEditor: React.FC<RatingOptionsEditorProps> = ({
  ratingOptions,
  onChange,
}) => {
  const [newRating, setNewRating] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("#9b87f5");
  const [newLabel, setNewLabel] = useState("");
  const [newWeight, setNewWeight] = useState<number>(1);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAddRating = () => {
    if (!newRating.trim()) return;
    const newOption: CompMatrixRatingOption = {
      id: 0,
      competencyMatrixId: 0,
      sortOrder: 0,
      title: newRating,
      definition: newDescription,
      color: newColor,
      radioButtonLabel: newLabel,
      calculationWeight: newWeight,
    };
    onChange([...ratingOptions, newOption]);
    setNewRating("");
    setNewDescription("");
    setNewColor("#9b87f5");
    setNewLabel("");
    setNewWeight(1);
  };

  const handleRemoveRating = (ratingTitle: string) => {
    const updatedOptions = ratingOptions.filter(
      (opt) => opt.title !== ratingTitle,
    );
    onChange(updatedOptions);
  };

  const handleUpdateRating = (
    ratingTitle: string,
    updates: Partial<CompMatrixRatingOption>,
  ) => {
    const updatedOptions = ratingOptions.map((opt) =>
      opt.title === ratingTitle ? { ...opt, ...updates } : opt,
    );
    onChange(updatedOptions);
  };

  const handleUpdateRatingName = (oldTitle: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    const updatedOptions = ratingOptions.map((opt) =>
      opt.title === oldTitle ? { ...opt, title: newTitle } : opt,
    );
    onChange(updatedOptions);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ratingOptions.findIndex((r) => r.title === active.id);
    const newIndex = ratingOptions.findIndex((r) => r.title === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedOptions = [...ratingOptions];
      const [moved] = updatedOptions.splice(oldIndex, 1);
      if (moved) {
        updatedOptions.splice(newIndex, 0, moved);
        onChange(updatedOptions);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold">Rating Options</h3>
        <p className="text-muted-foreground text-sm">
          Define the rating options that will be available for assessment
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="rating-name">Rating Name</Label>
          <Input
            id="rating-name"
            placeholder="e.g. Proficient"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating-description">Description</Label>
          <Input
            id="rating-description"
            placeholder="e.g. Has deep understanding"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating-label">Button Label</Label>
          <Input
            id="rating-label"
            placeholder="e.g. PROF"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value.toUpperCase())}
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating-weight">Weight</Label>
          <Input
            id="rating-weight"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 4"
            value={newWeight}
            onChange={(e) => setNewWeight(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating-color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="rating-color"
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-10 w-16 p-1"
            />
            <Input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddRating} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ratingOptions.map((opt) => opt.title)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-4 space-y-2">
            {ratingOptions.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No rating options defined yet. Add your first rating above.
              </p>
            ) : (
              ratingOptions.map((opt) => (
                <SortableRatingOption
                  key={opt.title}
                  rating={opt.title}
                  description={opt.definition || ""}
                  color={opt.color || "#e2e8f0"}
                  label={opt.radioButtonLabel || ""}
                  weight={opt.calculationWeight ?? 1}
                  onUpdateDescription={(rating, description) =>
                    handleUpdateRating(rating, { definition: description })
                  }
                  onUpdateColor={(rating, color) =>
                    handleUpdateRating(rating, { color })
                  }
                  onUpdateLabel={(rating, label) =>
                    handleUpdateRating(rating, {
                      radioButtonLabel: label.toUpperCase(),
                    })
                  }
                  onUpdateWeight={(rating, weight) =>
                    handleUpdateRating(rating, { calculationWeight: weight })
                  }
                  onRemove={handleRemoveRating}
                  onUpdateName={(newRatingName) =>
                    handleUpdateRatingName(opt.title, newRatingName)
                  }
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface SortableRatingOptionProps {
  rating: string;
  description: string;
  color: string;
  label: string;
  weight: number;
  onUpdateDescription: (rating: string, description: string) => void;
  onUpdateColor: (rating: string, color: string) => void;
  onUpdateLabel: (rating: string, label: string) => void;
  onUpdateWeight: (rating: string, weight: number) => void;
  onRemove: (rating: string) => void;
  onUpdateName: (newRatingName: string) => void;
}

const SortableRatingOption: React.FC<SortableRatingOptionProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.rating });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="text-muted-foreground h-5 w-5" />
            </div>

            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: props.color }}
            >
              <CircleCheck className="h-5 w-5 text-white" />
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-5">
              <Input
                value={props.rating}
                onChange={(e) => props.onUpdateName(e.target.value)}
                className="w-full"
              />

              <Textarea
                value={props.description}
                onChange={(e) =>
                  props.onUpdateDescription(props.rating, e.target.value)
                }
                placeholder="Description"
                className="h-10 w-full resize-none py-2"
              />

              <Input
                value={props.label}
                onChange={(e) =>
                  props.onUpdateLabel(
                    props.rating,
                    e.target.value.toUpperCase(),
                  )
                }
                placeholder="LABEL"
                className="w-full uppercase"
                maxLength={6}
              />

              <Input
                type="number"
                min="1"
                step="1"
                value={props.weight}
                onChange={(e) =>
                  props.onUpdateWeight(
                    props.rating,
                    parseInt(e.target.value) || 1,
                  )
                }
                placeholder="Weight"
                className="w-full"
              />

              <div className="flex gap-2">
                <Input
                  type="color"
                  value={props.color}
                  onChange={(e) =>
                    props.onUpdateColor(props.rating, e.target.value)
                  }
                  className="w-12 p-1"
                />
                <Input
                  type="text"
                  value={props.color}
                  onChange={(e) =>
                    props.onUpdateColor(props.rating, e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => props.onRemove(props.rating)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
