"use client";

import React, { useState, useEffect } from "react";
import CompetencyMatrixCell from "./competency-matrix-cell";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
import type {
  CompMatrixCellSavePayloadUI,
  CompMatrixRatingsForUIMap,
  CompMatrixReferenceRatings,
} from "~/server/queries/comp-matrix-current-rating";
import type { CompMatrixLevel } from "~/server/queries/comp-matrix-level";
import { type ViewMode, type Phase } from "./types";
import { fetchCompMatrixReferenceRatings } from "~/lib/client-api/comp-matrix-reference-ratings";

interface CompetencyMatrixRowProps {
  levels: CompMatrixLevel[];
  competency: CompMatrixCompetencyWithDefinitions;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  phase: Phase;
  viewMode: ViewMode;
  onSaveCell: (uiPayload: CompMatrixCellSavePayloadUI) => Promise<void>;
  compMatrixId?: number;
}

const CompetencyMatrixRow: React.FC<CompetencyMatrixRowProps> = ({
  levels,
  competency,
  ratingOptions,
  compMatrixCurrentRating,
  phase,
  viewMode,
  onSaveCell,
  compMatrixId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [referenceRatings, setReferenceRatings] = useState<
    Record<number, CompMatrixReferenceRatings[]>
  >({});

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded && phase === "calibration" && compMatrixId) {
      const fetchRatings = async () => {
        const ratings = await fetchCompMatrixReferenceRatings(
          compMatrixId,
          competency.id,
        );
        setReferenceRatings(ratings);
      };
      void fetchRatings();
    }
  }, [isExpanded, phase, compMatrixId, competency.id]);

  // Helper: get all unique names from referenceRatings
  const uniqueReferenceNames = React.useMemo(() => {
    const namesSet = new Set<string>();
    Object.values(referenceRatings).forEach((ratingsArr) => {
      ratingsArr.forEach((r) => namesSet.add(r.fullName));
    });
    return Array.from(namesSet);
  }, [referenceRatings]);

  return (
    <div className="flex flex-col">
      {/* Row header with competency name */}
      <div className="flex">
        {/* First column: unique names if calibration phase and expanded */}
        <div
          className="border-border bg-muted/10 flex w-[17.55%] cursor-pointer border-r p-3"
          onClick={handleToggleExpand}
        >
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
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
            {isExpanded &&
              phase === "calibration" &&
              uniqueReferenceNames.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 pt-2">
                  {uniqueReferenceNames.map((name) => (
                    <span
                      key={name}
                      className="text-primary-foreground flex h-6 items-center justify-end truncate text-right text-xs leading-none"
                      title={name}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>

        <div
          className={`flex flex-1 ${isExpanded ? "border-b-0" : "border-b"} border-border`}
        >
          {levels.map((level, index) => {
            const defId = competency?.definitions[index]?.id;
            const defIdStr = defId?.toString() ?? "0";

            return (
              <CompetencyMatrixCell
                key={index}
                phase={phase}
                isActive={false}
                onSaveCell={onSaveCell}
                cellIndex={index}
                competencyDefinition={
                  competency?.definitions[index]?.definition || ""
                }
                definitionId={defId || 0}
                isExpanded={isExpanded}
                viewMode={viewMode}
                ratingOptions={ratingOptions ?? []}
                inheritsPreviousLevel={
                  competency?.definitions[index]?.inheritsPreviousLevel ?? false
                }
                currentRating={
                  compMatrixCurrentRating?.[defId ?? 0] ?? {
                    selfRatingId: undefined,
                    selfComment: null,
                    selfRatingUpdatedAt: new Date(),
                    managerId: null,
                    managerRatingId: undefined,
                    managerComment: null,
                    managerRatingUpdatedAt: new Date(),
                  }
                }
                referenceRatings={referenceRatings[level.id] ?? []}
                referenceNames={uniqueReferenceNames}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompetencyMatrixRow;
