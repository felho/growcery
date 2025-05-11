"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  X,
  Save,
  Pencil,
} from "lucide-react";
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
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CompetencyItem from "./competency-item";
import type {
  CompetencyCategory,
  CompetencyItem as CompetencyItemType,
} from "~/data/mock-competency-data";
import { Textarea } from "~/components/ui/textarea";

interface CompetencyAreaProps {
  category: CompetencyCategory;
  onUpdateCategory: (id: string, updates: Partial<CompetencyCategory>) => void;
  onRemove: (id: string) => void;
  onAddCompetency: (areaId: string) => void;
  onEditCompetency: (areaId: string, competency: CompetencyItemType) => void;
  onRemoveCompetency: (areaId: string, competencyId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dragHandleProps: any;
  onReorderItems: (categoryId: string, items: CompetencyItemType[]) => void;
}

const CompetencyArea: React.FC<CompetencyAreaProps> = ({
  category,
  onUpdateCategory,
  onRemove,
  onAddCompetency,
  onEditCompetency,
  onRemoveCompetency,
  isOpen,
  onOpenChange,
  dragHandleProps,
  onReorderItems,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [editingName, setEditingName] = React.useState(category.category);
  const [editingDescription, setEditingDescription] = React.useState(
    category.description || "",
  );

  const handleSave = () => {
    onUpdateCategory(category.id, {
      category: editingName.trim(),
      description: editingDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = category.items.findIndex((item) => item.id === active.id);
    const newIndex = category.items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedItems = [...category.items];
      const [moved] = updatedItems.splice(oldIndex, 1);
      if (moved) {
        updatedItems.splice(newIndex, 0, moved);
        onReorderItems(category.id, updatedItems);
      }
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="rounded-md border"
    >
      <div className="bg-muted/50 flex items-center justify-between p-4">
        <div className="flex flex-1 items-start gap-2">
          <div {...dragHandleProps} className="cursor-grab pt-2">
            <GripVertical className="text-muted-foreground h-5 w-5" />
          </div>
          {isEditing ? (
            <div className="w-full space-y-2">
              <div className="flex items-start gap-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1"
                  placeholder="Area name"
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 text-white hover:bg-green-500"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={editingDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setEditingDescription(e.target.value);
                  }
                }}
                className="w-full resize-none"
                placeholder="Short description (max 200 characters)"
                rows={2}
              />
              <div className="text-muted-foreground text-left text-xs">
                {editingDescription.length}/200
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.category}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10 h-7 rounded-full px-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
              {category.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {category.description}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(category.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CollapsibleContent className="space-y-4 border-t p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => onAddCompetency(category.id)}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={category.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {category.items.map((item) => (
                  <SortableCompetencyItem
                    key={item.id}
                    item={item}
                    categoryId={category.id}
                    onEdit={onEditCompetency}
                    onRemove={onRemoveCompetency}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface SortableCompetencyItemProps {
  item: CompetencyItemType;
  categoryId: string;
  onEdit: (areaId: string, competency: CompetencyItemType) => void;
  onRemove: (areaId: string, competencyId: string) => void;
}

const SortableCompetencyItem: React.FC<SortableCompetencyItemProps> = (
  props,
) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CompetencyItem
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

export default CompetencyArea;
