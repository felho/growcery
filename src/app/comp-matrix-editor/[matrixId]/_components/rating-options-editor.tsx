"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Plus, X, CircleCheck, GripVertical, Circle } from "lucide-react";
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

  // New editing state hooks
  const [editingRatingTitle, setEditingRatingTitle] = useState<string | null>(
    null,
  );
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedLabel, setEditedLabel] = useState("");
  const [editedWeight, setEditedWeight] = useState(1);
  const [editedColor, setEditedColor] = useState("");

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

  // Editing functions
  const startEditing = (option: CompMatrixRatingOption) => {
    setEditingRatingTitle(option.title);
    setEditedTitle(option.title);
    setEditedDescription(option.definition);
    setEditedLabel(option.radioButtonLabel);
    setEditedWeight(option.calculationWeight);
    setEditedColor(option.color);
  };

  const saveEditing = () => {
    if (!editingRatingTitle || !editedTitle.trim()) return;

    const updatedOptions = ratingOptions.map((opt) =>
      opt.title === editingRatingTitle
        ? {
            ...opt,
            title: editedTitle,
            definition: editedDescription,
            radioButtonLabel: editedLabel,
            calculationWeight: editedWeight,
            color: editedColor,
          }
        : opt,
    );
    onChange(updatedOptions);
    setEditingRatingTitle(null);
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
            <Button
              onClick={handleAddRating}
              className="cursor-pointer whitespace-nowrap"
            >
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
              ratingOptions.map((opt) =>
                editingRatingTitle === opt.title ? (
                  <Card key={opt.title} className="border">
                    <CardContent className="space-y-2 p-4">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                      <Input
                        value={editedLabel}
                        onChange={(e) =>
                          setEditedLabel(e.target.value.toUpperCase())
                        }
                      />
                      <Input
                        type="number"
                        value={editedWeight}
                        onChange={(e) =>
                          setEditedWeight(Number(e.target.value) || 1)
                        }
                      />
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={editedColor}
                          onChange={(e) => setEditedColor(e.target.value)}
                          className="w-16"
                        />
                        <Input
                          value={editedColor}
                          onChange={(e) => setEditedColor(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={saveEditing}
                          className="cursor-pointer"
                        >
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <SortableRatingOption
                    key={opt.title}
                    rating={opt.title}
                    description={opt.definition}
                    color={opt.color}
                    label={opt.radioButtonLabel}
                    weight={opt.calculationWeight}
                    onUpdateDescription={(rating, desc) =>
                      handleUpdateRating(rating, { definition: desc })
                    }
                    onUpdateColor={(rating, color) =>
                      handleUpdateRating(rating, { color })
                    }
                    onUpdateLabel={(rating, label) =>
                      handleUpdateRating(rating, { radioButtonLabel: label })
                    }
                    onUpdateWeight={(rating, weight) =>
                      handleUpdateRating(rating, { calculationWeight: weight })
                    }
                    onRemove={handleRemoveRating}
                    onUpdateName={(newRatingName) =>
                      handleUpdateRatingName(opt.title, newRatingName)
                    }
                    // Add edit button:
                    onEdit={() => startEditing(opt)}
                  />
                ),
              )
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
  onEdit?: () => void;
}

const SortableRatingOption: React.FC<SortableRatingOptionProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    onEdit,
  } = {
    ...useSortable({ id: props.rating }),
    onEdit: props.onEdit,
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Remove inline editing UI; only show view with Edit button
  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="text-muted-foreground h-5 w-5" />
            </div>

            <div className="mr-10 ml-8 flex w-20 flex-col items-center justify-center">
              <div
                className="rounded-full"
                style={{
                  backgroundColor: props.color,
                  width: "36px",
                  height: "36px",
                }}
              />
              <span className="mt-3 text-center text-sm font-medium">
                {props.rating}
              </span>
            </div>
            <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-4">
              <div className="col-span-3 grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                <div>
                  <span className="text-muted-foreground block">
                    {props.description}
                  </span>
                </div>
                <div className="ml-20">
                  <span className="uppercase">{props.label}</span>
                </div>
                <div className="ml-5">
                  <span>{props.weight}</span>
                </div>
              </div>
              <div className="flex items-start justify-end">
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={onEdit}
                      title="Edit"
                      className="cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 0 0 .707-.293l9.414-9.414a2 2 0 0 0 0-2.828l-3.172-3.172a2 2 0 0 0-2.828 0l-9.414 9.414A1 1 0 0 0 4 20z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => props.onRemove(props.rating)}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
