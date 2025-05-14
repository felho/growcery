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
// import type {
//   CompetencyCategory,
//   CompetencyItem as CompetencyItemType,
// } from "~/data/mock-competency-data";
import type {
  CompMatrixAreaEditUI,
  CompMatrixAreaWithFullRelations,
} from "~/server/queries/comp-matrix-area";
import { Textarea } from "~/components/ui/textarea";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";

interface CompetencyAreaProps {
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
  dragHandleProps: any;
  onReorderItems: (
    categoryId: string,
    items: CompMatrixCompetencyWithDefinitions[],
  ) => void;
  //TODO: check whether this is really needed
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

const CompetencyArea: React.FC<CompetencyAreaProps> = ({
  category,
  onUpdateArea,
  onRemove,
  onAddCompetency,
  onEditCompetency,
  onRemoveCompetency,
  isOpen,
  onOpenChange,
  dragHandleProps,
  onReorderItems,
  onSaveCompetency,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [editingName, setEditingName] = React.useState(category.title);
  const [editingDescription, setEditingDescription] = React.useState(
    category.shortDescription || "",
  );

  const handleSave = () => {
    onUpdateArea({
      id: category.id,
      title: editingName.trim(),
      shortDescription: editingDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = category.competencies.findIndex(
      (item: CompMatrixCompetencyWithDefinitions) => item.id === active.id,
    );
    const newIndex = category.competencies.findIndex(
      (item: CompMatrixCompetencyWithDefinitions) => item.id === over.id,
    );
    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedItems = [...category.competencies];
      const [moved] = updatedItems.splice(oldIndex, 1);
      if (moved) {
        updatedItems.splice(newIndex, 0, moved);
        onReorderItems(category.id.toString(), updatedItems);
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
            <div className="w-full max-w-xs space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Area name"
                    className="w-full"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 text-white hover:bg-green-500"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
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
                <div className="text-muted-foreground absolute right-2 bottom-1 text-xs">
                  {editingDescription.length}/200
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.title}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10 h-7 rounded-full px-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
              {category.shortDescription && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {category.shortDescription}
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
            onClick={() => onRemove(category.id.toString())}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CollapsibleContent className="space-y-4 border-t p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => onAddCompetency(category.id.toString())}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Competency
          </Button>
        </div>

        {category.competencies.length === 0 ? (
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
              items={category.competencies.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {category.competencies.map((item) => (
                  <SortableCompetencyItem
                    key={item.id}
                    item={item}
                    categoryId={category.id.toString()}
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
  item: CompMatrixCompetencyWithDefinitions;
  categoryId: string;
  onEdit: (
    areaId: string,
    competency: CompMatrixCompetencyWithDefinitions,
  ) => void;
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
