"use client";

import React from "react";
import {
  type CompetencyCategory,
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
import type { CompMatrixLevel } from "~/server/queries/comp-matrix-level";
interface CompetencyAreaSectionProps {
  levels: CompMatrixLevel[];
  area: CompMatrixAreaWithFullRelations;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  category: CompetencyCategory;
  phase: Phase;
  viewMode: "employee" | "manager";
  categoryIndex: number;
  onSaveCell: (uiPayload: CompMatrixCellSavePayloadUI) => Promise<void>;
}

const CompetencyAreaSection: React.FC<CompetencyAreaSectionProps> = ({
  area,
  levels,
  ratingOptions,
  compMatrixCurrentRating,
  category,
  phase,
  viewMode,
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
          const competency = area.competencies.find(
            (c) => c.title === item.name,
          );

          return (
            <CompetencyMatrixRow
              key={`${category.id}-${item.id}`}
              levels={levels}
              competency={competency as CompMatrixCompetencyWithDefinitions}
              ratingOptions={ratingOptions}
              compMatrixCurrentRating={compMatrixCurrentRating}
              phase={phase}
              viewMode={viewMode}
              onSaveCell={onSaveCell}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompetencyAreaSection;
