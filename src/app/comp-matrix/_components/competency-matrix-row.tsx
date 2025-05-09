"use client";

import React, { useState } from "react";
import { experienceLevels, type Phase } from "~/data/mock-competency-data";
import CompetencyMatrixCell from "./competency-matrix-cell";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
import type {
  CompMatrixCellSavePayloadUI,
  CompMatrixRatingsForUIMap,
} from "~/server/queries/comp-matrix-current-rating";

interface CompetencyMatrixRowProps {
  competencyName: string;
  competency: CompMatrixCompetencyWithDefinitions;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  phase: Phase;
  viewMode: "employee" | "manager";
  onSaveCell: (uiPayload: CompMatrixCellSavePayloadUI) => Promise<void>;
}

const CompetencyMatrixRow: React.FC<CompetencyMatrixRowProps> = ({
  competency,
  ratingOptions,
  compMatrixCurrentRating,
  phase,
  viewMode,
  onSaveCell,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      {/* Row header with competency name */}
      <div className="flex">
        <div
          className="border-border bg-muted/10 flex w-[17.55%] cursor-pointer border-r p-3"
          onClick={handleToggleExpand}
        >
          <div className="flex w-full gap-2">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            )}
            <span
              className="truncate text-sm whitespace-nowrap"
              title={competency?.title}
            >
              {competency?.title}
            </span>
          </div>
        </div>

        <div
          className={`flex flex-1 ${isExpanded ? "border-b-0" : "border-b"} border-border`}
        >
          {experienceLevels.map((level, index) => (
            <CompetencyMatrixCell
              key={index}
              phase={phase}
              isActive={false}
              onSaveCell={onSaveCell}
              cellIndex={index}
              competencyDefinition={
                competency?.definitions[index]?.definition || ""
              }
              definitionId={competency?.definitions[index]?.id || 0}
              isExpanded={isExpanded}
              viewMode={viewMode}
              ratingOptions={ratingOptions ?? []}
              currentRating={
                compMatrixCurrentRating?.[
                  competency?.definitions[index]?.id || 0
                ] ?? {
                  selfRatingId: undefined,
                  selfComment: null,
                  selfRatingUpdatedAt: new Date(),
                  managerId: null,
                  managerRatingId: undefined,
                  managerComment: null,
                  managerRatingUpdatedAt: new Date(),
                }
              }
            />
          ))}
        </div>
      </div>

      {/* If expanded with calibration phase, show message */}
      {isExpanded && phase === "calibration" && (
        <div className="bg-muted/5 border-border border-t p-4">
          <div className="text-center text-sm">
            Expanded view is not available in calibration mode
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetencyMatrixRow;
