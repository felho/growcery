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
  phase: "assessment" | "discussion" | "calibration";
  isHeatmapView: boolean;
  showBothRatings: boolean;
  viewMode: "employee" | "manager" | "both";
  updateCompetency: (
    categoryIndex: number,
    itemIndex: number,
    field: "employeeRating" | "managerRating" | "employeeNote" | "managerNote",
    value: Rating | string,
  ) => void;
  categoryIndex: number;
}

const CompetencyAreaSection: React.FC<CompetencyAreaSectionProps> = ({
  area,
  category,
  phase,
  isHeatmapView,
  showBothRatings,
  viewMode,
  updateCompetency,
  categoryIndex,
}) => {
  return (
    <div className="mb-0">
      <div className="bg-muted border-border flex items-center justify-between rounded-t-md border p-2 font-semibold">
        <span>{area.title}</span>
        {area.shortDescription && (
          <span className="text-muted-foreground text-xs">
            {area.shortDescription}
          </span>
        )}
      </div>
      <div className="border-border border-r border-l">
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
              phase={phase}
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
    </div>
  );
};

export default CompetencyAreaSection;
