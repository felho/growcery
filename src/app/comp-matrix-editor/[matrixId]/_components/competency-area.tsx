"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown, ChevronUp, GripVertical, Plus, X } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CompetencyItem from "./competency-item";
import type {
  CompetencyCategory,
  CompetencyItem as CompetencyItemType,
} from "~/data/mock-competency-data";

interface CompetencyAreaProps {
  category: CompetencyCategory;
  onUpdateName: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onAddCompetency: (areaId: string) => void;
  onEditCompetency: (areaId: string, competency: CompetencyItemType) => void;
  onRemoveCompetency: (areaId: string, competencyId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dragHandleProps: any;
}

const CompetencyArea: React.FC<CompetencyAreaProps> = ({
  category,
  onUpdateName,
  onRemove,
  onAddCompetency,
  onEditCompetency,
  onRemoveCompetency,
  isOpen,
  onOpenChange,
  dragHandleProps,
}) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="rounded-md border"
    >
      <div className="bg-muted/50 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <GripVertical className="text-muted-foreground h-5 w-5" />
          <Input
            value={category.category}
            onChange={(e) => onUpdateName(category.id, e.target.value)}
            className="h-auto border-none bg-transparent p-0 focus-visible:ring-0"
          />
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
          <Droppable droppableId={category.id} type="competency">
            {(provided: any) => (
              <div
                className="space-y-2"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {category.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                      >
                        <CompetencyItem
                          item={item}
                          categoryId={category.id}
                          onEdit={onEditCompetency}
                          onRemove={onRemoveCompetency}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CompetencyArea;
