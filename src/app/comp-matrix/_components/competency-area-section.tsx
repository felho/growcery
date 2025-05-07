"use client";

import React from "react";
import {
  type CompetencyCategory,
  type Rating,
} from "~/data/mock-competency-data";
import CompetencyMatrixRow from "./competency-matrix-row";
import type { CompMatrixAreaWithFullRelations } from "~/server/queries/comp-matrix-area";

interface CompetencyAreaSectionProps {
  area: CompMatrixAreaWithFullRelations;
  category: CompetencyCategory;
  isHeatmapView: boolean;
  showBothRatings: boolean;
  viewMode: "employee" | "manager" | "both";
  updateCompetency: (
    categoryIndex: number,
    itemIndex: number,
    field: "employeeRating" | "managerRating" | "employeeNote" | "managerNote",
    value: any,
  ) => void;
  categoryIndex: number;
}

export default function CompetencyAreaSection({
  area,
  category,
  isHeatmapView,
  showBothRatings,
  viewMode,
  updateCompetency,
  categoryIndex,
}: CompetencyAreaSectionProps) {
  return (
    <div className="border-border border-t">
      <div className="bg-muted/50 p-4">
        <h3 className="font-semibold">{category.category}</h3>
        <p className="text-muted-foreground text-sm">{category.description}</p>
      </div>
      {category.items.map((item, itemIndex) => {
        const dbCompetency = area.competencies.find(
          (c) => c.title === item.name,
        );

        return (
          <CompetencyMatrixRow
            key={`${category.id}-${item.id}`}
            competencyName={item.name}
            competency={item}
            dbCompetency={dbCompetency}
            isHeatmapView={isHeatmapView}
            showBothRatings={showBothRatings}
            viewMode={viewMode}
            updateEmployeeRating={(rating) =>
              updateCompetency(
                categoryIndex,
                itemIndex,
                "employeeRating",
                rating,
              )
            }
            updateManagerRating={(rating) =>
              updateCompetency(
                categoryIndex,
                itemIndex,
                "managerRating",
                rating,
              )
            }
            updateEmployeeNote={(note) =>
              updateCompetency(categoryIndex, itemIndex, "employeeNote", note)
            }
            updateManagerNote={(note) =>
              updateCompetency(categoryIndex, itemIndex, "managerNote", note)
            }
          />
        );
      })}
    </div>
  );
}
