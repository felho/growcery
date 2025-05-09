"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Plus, X, CircleCheck, GripVertical } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedOptions = [...ratingOptions];
    const [movedItem] = reorderedOptions.splice(result.source.index, 1);
    if (!movedItem) return;
    reorderedOptions.splice(result.destination.index, 0, movedItem);
    onChange({
      ratingOptions: reorderedOptions,
      ratingDescriptions,
      ratingColors,
      ratingLabels,
      ratingWeights,
    });
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ratings">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mt-4 space-y-2"
            >
              {ratingOptions.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No rating options defined yet. Add your first rating above.
                </p>
              ) : (
                ratingOptions.map((rating, index) => (
                  <Draggable key={rating} draggableId={rating} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-border border"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab"
                            >
                              <GripVertical className="text-muted-foreground h-5 w-5" />
                            </div>

                            <div
                              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                              style={{
                                backgroundColor:
                                  ratingColors[rating] || "#e2e8f0",
                              }}
                            >
                              <CircleCheck className="h-5 w-5 text-white" />
                            </div>

                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-5">
                              <Input
                                value={rating}
                                onChange={(e) => {
                                  const newRatingName = e.target.value;
                                  if (!newRatingName.trim()) return;

                                  // Create new arrays/objects with updated rating name
                                  const updatedOptions = ratingOptions.map(
                                    (r) => (r === rating ? newRatingName : r),
                                  );

                                  const updatedDescriptions = {
                                    ...ratingDescriptions,
                                  };
                                  updatedDescriptions[newRatingName] =
                                    updatedDescriptions[rating];
                                  delete updatedDescriptions[rating];

                                  const updatedColors = { ...ratingColors };
                                  updatedColors[newRatingName] =
                                    updatedColors[rating];
                                  delete updatedColors[rating];

                                  const updatedLabels = { ...ratingLabels };
                                  updatedLabels[newRatingName] =
                                    updatedLabels[rating];
                                  delete updatedLabels[rating];

                                  const updatedWeights = { ...ratingWeights };
                                  updatedWeights[newRatingName] =
                                    updatedWeights[rating];
                                  delete updatedWeights[rating];

                                  onChange({
                                    ratingOptions: updatedOptions,
                                    ratingDescriptions: updatedDescriptions,
                                    ratingColors: updatedColors,
                                    ratingLabels: updatedLabels,
                                    ratingWeights: updatedWeights,
                                  });
                                }}
                                className="w-full"
                              />

                              <Textarea
                                value={ratingDescriptions[rating] || ""}
                                onChange={(e) =>
                                  handleUpdateRatingDescription(
                                    rating,
                                    e.target.value,
                                  )
                                }
                                placeholder="Description"
                                className="h-10 w-full resize-none py-2"
                              />

                              <Input
                                value={ratingLabels[rating] || ""}
                                onChange={(e) =>
                                  handleUpdateRatingLabel(
                                    rating,
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
                                value={ratingWeights[rating] || 1}
                                onChange={(e) =>
                                  handleUpdateRatingWeight(
                                    rating,
                                    parseInt(e.target.value) || 1,
                                  )
                                }
                                placeholder="Weight"
                                className="w-full"
                              />

                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={ratingColors[rating] || "#e2e8f0"}
                                  onChange={(e) =>
                                    handleUpdateRatingColor(
                                      rating,
                                      e.target.value,
                                    )
                                  }
                                  className="w-12 p-1"
                                />
                                <Input
                                  type="text"
                                  value={ratingColors[rating] || "#e2e8f0"}
                                  onChange={(e) =>
                                    handleUpdateRatingColor(
                                      rating,
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1"
                                />
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleRemoveRating(rating)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
