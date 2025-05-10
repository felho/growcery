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
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "~/components/ui/form";

interface RatingOptionsEditorProps {
  ratingOptions: string[];
  ratingDescriptions: Record<string, string>;
  ratingColors: Record<string, string>;
  ratingLabels?: Record<string, string>;
  ratingWeights?: Record<string, number>;
  onChange: (data: {
    ratingOptions: string[];
    ratingDescriptions: Record<string, string>;
    ratingColors: Record<string, string>;
    ratingLabels: Record<string, string>;
    ratingWeights: Record<string, number>;
  }) => void;
}

export const RatingOptionsEditor: React.FC<RatingOptionsEditorProps> = ({
  ratingOptions,
  ratingDescriptions,
  ratingColors,
  ratingLabels = {},
  ratingWeights = {},
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

    const updatedOptions = [...ratingOptions, newRating];
    const updatedDescriptions = {
      ...ratingDescriptions,
      [newRating]: newDescription,
    };
    const updatedColors = {
      ...ratingColors,
      [newRating]: newColor,
    };
    const updatedLabels = {
      ...ratingLabels,
      [newRating]: newLabel,
    };
    const updatedWeights = {
      ...ratingWeights,
      [newRating]: newWeight,
    };

    onChange({
      ratingOptions: updatedOptions,
      ratingDescriptions: updatedDescriptions,
      ratingColors: updatedColors,
      ratingLabels: updatedLabels,
      ratingWeights: updatedWeights,
    });

    setNewRating("");
    setNewDescription("");
    setNewColor("#9b87f5");
    setNewLabel("");
    setNewWeight(1);
  };

  const handleRemoveRating = (rating: string) => {
    const updatedOptions = ratingOptions.filter((r) => r !== rating);
    const { [rating]: _, ...updatedDescriptions } = ratingDescriptions;
    const { [rating]: __, ...updatedColors } = ratingColors;
    const { [rating]: ___, ...updatedLabels } = ratingLabels;
    const { [rating]: ____, ...updatedWeights } = ratingWeights;

    onChange({
      ratingOptions: updatedOptions,
      ratingDescriptions: updatedDescriptions,
      ratingColors: updatedColors,
      ratingLabels: updatedLabels,
      ratingWeights: updatedWeights,
    });
  };

  const handleUpdateRatingDescription = (
    rating: string,
    description: string,
  ) => {
    onChange({
      ratingOptions,
      ratingDescriptions: { ...ratingDescriptions, [rating]: description },
      ratingColors,
      ratingLabels,
      ratingWeights,
    });
  };

  const handleUpdateRatingColor = (rating: string, color: string) => {
    onChange({
      ratingOptions,
      ratingDescriptions,
      ratingColors: { ...ratingColors, [rating]: color },
      ratingLabels,
      ratingWeights,
    });
  };

  const handleUpdateRatingLabel = (rating: string, label: string) => {
    onChange({
      ratingOptions,
      ratingDescriptions,
      ratingColors,
      ratingLabels: { ...ratingLabels, [rating]: label },
      ratingWeights,
    });
  };

  const handleUpdateRatingWeight = (rating: string, weight: number) => {
    onChange({
      ratingOptions,
      ratingDescriptions,
      ratingColors,
      ratingLabels,
      ratingWeights: { ...ratingWeights, [rating]: weight },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ratingOptions.findIndex((r) => r === active.id);
    const newIndex = ratingOptions.findIndex((r) => r === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedOptions = [...ratingOptions];
      const [moved] = updatedOptions.splice(oldIndex, 1);
      if (moved) {
        updatedOptions.splice(newIndex, 0, moved);
        onChange({
          ratingOptions: updatedOptions,
          ratingDescriptions,
          ratingColors,
          ratingLabels,
          ratingWeights,
        });
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
          items={ratingOptions}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-4 space-y-2">
            {ratingOptions.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No rating options defined yet. Add your first rating above.
              </p>
            ) : (
              ratingOptions.map((rating) => (
                <SortableRatingOption
                  key={rating}
                  rating={rating}
                  description={ratingDescriptions[rating] || ""}
                  color={ratingColors[rating] || "#e2e8f0"}
                  label={ratingLabels[rating] || ""}
                  weight={ratingWeights[rating] || 1}
                  onUpdateDescription={handleUpdateRatingDescription}
                  onUpdateColor={handleUpdateRatingColor}
                  onUpdateLabel={handleUpdateRatingLabel}
                  onUpdateWeight={handleUpdateRatingWeight}
                  onRemove={handleRemoveRating}
                  onUpdateName={(newRatingName) => {
                    if (!newRatingName.trim()) return;

                    const updatedOptions = ratingOptions.map((r) =>
                      r === rating ? newRatingName : r,
                    );

                    const updatedDescriptions = { ...ratingDescriptions };
                    updatedDescriptions[newRatingName] =
                      updatedDescriptions[rating] || "";
                    delete updatedDescriptions[rating];

                    const updatedColors = { ...ratingColors };
                    updatedColors[newRatingName] = updatedColors[rating] || "";
                    delete updatedColors[rating];

                    const updatedLabels = { ...ratingLabels };
                    updatedLabels[newRatingName] = updatedLabels[rating] || "";
                    delete updatedLabels[rating];

                    const updatedWeights = { ...ratingWeights };
                    updatedWeights[newRatingName] = updatedWeights[rating] || 1;
                    delete updatedWeights[rating];

                    onChange({
                      ratingOptions: updatedOptions,
                      ratingDescriptions: updatedDescriptions,
                      ratingColors: updatedColors,
                      ratingLabels: updatedLabels,
                      ratingWeights: updatedWeights,
                    });
                  }}
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
