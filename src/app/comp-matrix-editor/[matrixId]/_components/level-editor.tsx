"use client";

import React, { useState } from "react";
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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

interface LevelMetadata {
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

interface LevelData {
  name: string;
  metadata: LevelMetadata;
}

interface LevelEditorProps {
  levels: string[] | LevelData[];
  onChange: (levels: string[] | LevelData[]) => void;
}

interface NewLevelFormValues {
  name: string;
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

export const LevelEditor = ({ levels, onChange }: LevelEditorProps) => {
  const [showNewLevelForm, setShowNewLevelForm] = useState(false);
  const [insertPosition, setInsertPosition] = useState(-1);
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>(
    {},
  );

  const form = useForm<NewLevelFormValues>({
    defaultValues: {
      name: "",
      title: "",
      description: "",
      persona: "",
      areaOfImpact: "",
    },
  });

  const isUsingMetadata = levels.length > 0 && typeof levels[0] !== "string";

  const levelsWithMetadata: LevelData[] = isUsingMetadata
    ? (levels as LevelData[])
    : (levels as string[]).map((level) => ({
        name: level,
        metadata: { title: "", description: "", persona: "", areaOfImpact: "" },
      }));

  const handleAddLevel = (data: NewLevelFormValues) => {
    if (!data.name.trim()) return;

    const newLevelData: LevelData = {
      name: data.name,
      metadata: {
        title: data.title,
        description: data.description,
        persona: data.persona,
        areaOfImpact: data.areaOfImpact,
      },
    };

    const updatedLevels = [...levelsWithMetadata];
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
    const updatedLevels = [...levelsWithMetadata];
    updatedLevels.splice(index, 1);
    onChange(updatedLevels);
  };

  const handleMoveLevel = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === levelsWithMetadata.length - 1)
    )
      return;

    const updatedLevels = [...levelsWithMetadata];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updatedLevels[index], updatedLevels[targetIndex]] = [
      updatedLevels[targetIndex],
      updatedLevels[index],
    ];

    onChange(updatedLevels);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedLevels = [...levelsWithMetadata];
    const [movedItem] = updatedLevels.splice(result.source.index, 1);
    updatedLevels.splice(result.destination.index, 0, movedItem);
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
    const updatedLevels = [...levelsWithMetadata];
    updatedLevels[index] = {
      ...updatedLevels[index],
      metadata: { ...updatedLevels[index].metadata, [field]: value },
    };
    onChange(updatedLevels);
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="levels">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {levelsWithMetadata.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No levels defined yet. Add your first level above.
                </p>
              ) : (
                levelsWithMetadata.map((level, index) => (
                  <Draggable
                    key={level.name + index}
                    draggableId={level.name + index}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-border border"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="text-muted-foreground h-5 w-5" />
                              </div>
                              <span>{level.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setInsertPosition(index);
                                  setShowNewLevelForm(true);
                                  form.reset();
                                }}
                              >
                                Insert Before
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMoveLevel(index, "up")}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMoveLevel(index, "down")}
                                disabled={
                                  index === levelsWithMetadata.length - 1
                                }
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleExpand(index)}
                              >
                                {expandedLevels[index] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveLevel(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {expandedLevels[index] && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <label className="mb-1 block text-sm font-medium">
                                  Title
                                </label>
                                <Input
                                  value={level.metadata.title}
                                  onChange={(e) =>
                                    updateMetadata(
                                      index,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-sm font-medium">
                                  Description
                                </label>
                                <Textarea
                                  value={level.metadata.description}
                                  onChange={(e) =>
                                    updateMetadata(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                  <label className="mb-1 block text-sm font-medium">
                                    Persona
                                  </label>
                                  <Input
                                    value={level.metadata.persona}
                                    onChange={(e) =>
                                      updateMetadata(
                                        index,
                                        "persona",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-sm font-medium">
                                    Area of Impact
                                  </label>
                                  <Input
                                    value={level.metadata.areaOfImpact}
                                    onChange={(e) =>
                                      updateMetadata(
                                        index,
                                        "areaOfImpact",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
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
