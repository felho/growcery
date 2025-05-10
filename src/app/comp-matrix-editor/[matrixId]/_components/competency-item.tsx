"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Edit, GripVertical, X } from "lucide-react";
import type { CompetencyItem as CompetencyItemType } from "~/data/mock-competency-data";

interface CompetencyItemProps {
  item: CompetencyItemType;
  categoryId: string;
  onEdit: (areaId: string, competency: CompetencyItemType) => void;
  onRemove: (areaId: string, competencyId: string) => void;
  dragHandleProps: any;
}

const CompetencyItem: React.FC<CompetencyItemProps> = ({
  item,
  categoryId,
  onEdit,
  onRemove,
  dragHandleProps,
}) => {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps}>
            <GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
          </div>
          <CardTitle className="text-base">{item.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(categoryId, item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(categoryId, item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-muted-foreground text-sm">
          {item.definition || "No definition provided"}
        </p>
      </CardContent>
    </Card>
  );
};

export default CompetencyItem;
