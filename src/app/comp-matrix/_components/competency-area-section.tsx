"use client";

import React from "react";
import {
  type CompetencyCategory,
  type Rating,
  type Phase,
} from "~/data/mock-competency-data";
import CompetencyMatrixRow from "./competency-matrix-row";
import type { CompMatrixAreaWithFullRelations } from "~/server/queries/comp-matrix-area";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
import type {
  CompMatrixCellSavePayloadUI,
  CompMatrixRatingsForUIMap,
} from "~/server/queries/comp-matrix-current-rating";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";
interface CellRating {
  employeeRating?: Rating;
  managerRating?: Rating;
  employeeNote?: string;
  managerNote?: string;
}

interface CompetencyAreaSectionProps {
  area: CompMatrixAreaWithFullRelations;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  category: CompetencyCategory;
  phase: Phase;
  viewMode: "employee" | "manager";
  updateCompetency: (
    categoryIndex: number,
    itemIndex: number,
    rating: CellRating,
  ) => void;
  categoryIndex: number;
  onSaveCell: (uiPayload: CompMatrixCellSavePayloadUI) => Promise<void>;
}

const CompetencyAreaSection: React.FC<CompetencyAreaSectionProps> = ({
  area,
  ratingOptions,
  compMatrixCurrentRating,
  category,
  phase,
  viewMode,
  updateCompetency,
  categoryIndex,
  onSaveCell,
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
              dbCompetency={dbCompetency as CompMatrixCompetencyWithDefinitions}
              ratingOptions={ratingOptions}
              compMatrixCurrentRating={compMatrixCurrentRating}
              phase={phase}
              viewMode={viewMode}
              onUpdateRating={(rating) =>
                updateCompetency(categoryIndex, itemIndex, rating)
              }
              onSaveCell={onSaveCell}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompetencyAreaSection;
