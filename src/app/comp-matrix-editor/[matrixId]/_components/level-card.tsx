import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface LevelCardProps {
  level: LevelData;
  index: number;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onToggleExpand: (index: number) => void;
  onUpdateMetadata: (
    index: number,
    field: keyof LevelMetadata,
    value: string,
  ) => void;
  isExpanded: boolean;
  onInsertBefore: () => void;
  levelsLength: number;
}

export const LevelCard: React.FC<LevelCardProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(props.level.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="text-muted-foreground h-5 w-5" />
              </div>
              <span>{props.level.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={props.onInsertBefore}>
                Insert Before
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => props.onMove(props.index, "up")}
                disabled={props.index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => props.onMove(props.index, "down")}
                disabled={props.index === props.levelsLength - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => props.onToggleExpand(props.index)}
              >
                {props.isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => props.onRemove(props.index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {props.isExpanded && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <Input
                  value={props.level.metadata.title}
                  onChange={(e) =>
                    props.onUpdateMetadata(props.index, "title", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <Textarea
                  value={props.level.metadata.description}
                  onChange={(e) =>
                    props.onUpdateMetadata(
                      props.index,
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
                    value={props.level.metadata.persona}
                    onChange={(e) =>
                      props.onUpdateMetadata(
                        props.index,
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
                    value={props.level.metadata.areaOfImpact}
                    onChange={(e) =>
                      props.onUpdateMetadata(
                        props.index,
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
    </div>
  );
};
