"use client";

import React from "react";
import { type Phase, type ViewMode } from "./types";
import CompetencyMatrixRow from "./competency-matrix-row";
import type { CompMatrixAreaWithFullRelations } from "~/server/queries/comp-matrix-area";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
import type {
  CompMatrixCellSavePayloadUI,
  CompMatrixRatingsForUIMap,
} from "~/server/queries/comp-matrix-current-rating";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";
import type { CompMatrixLevel } from "~/server/queries/comp-matrix-level";
import { LevelAssessmentBadge } from "./level-assessment-badge";
import type { LevelAssessment } from "~/zod-schemas/comp-matrix-level-assessments";

interface CompetencyAreaSectionProps {
  levels: CompMatrixLevel[];
  area: CompMatrixAreaWithFullRelations;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  phase: Phase;
  viewMode: ViewMode;
  onSaveCell: (uiPayload: CompMatrixCellSavePayloadUI) => Promise<void>;
  compMatrixId?: number;
  referenceUserIds: number[];
  userCompMatrixAssignmentId?: number;
  levelAssessments?: LevelAssessment[];
  onLevelAssessmentSave?: () => void;
}

const CompetencyAreaSection: React.FC<CompetencyAreaSectionProps> = ({
  area,
  levels,
  ratingOptions,
  compMatrixCurrentRating,
  phase,
  viewMode,
  onSaveCell,
  compMatrixId,
  referenceUserIds,
  userCompMatrixAssignmentId,
  levelAssessments,
  onLevelAssessmentSave,
}) => {
  const areaAssessment = levelAssessments?.find(
    (a) => !a.isGeneral && a.compMatrixAreaId === area.id,
  );

  return (
    <div className="mb-0">
      <div className="bg-muted border-border flex items-center justify-between rounded-t-md border p-2 font-semibold">
        <div className="flex items-center gap-2">
          <span>{area.title}</span>
          {phase === "calibration" &&
            viewMode === "manager" &&
            userCompMatrixAssignmentId &&
            compMatrixId && (
              <div className="-mt-[2px]">
                <LevelAssessmentBadge
                  userCompMatrixAssignmentId={userCompMatrixAssignmentId}
                  compMatrixId={compMatrixId}
                  isGeneral={false}
                  compMatrixAreaId={area.id}
                  initialMainLevel={areaAssessment?.mainLevel}
                  initialSubLevel={areaAssessment?.subLevel}
                  maxLevel={levels.length}
                  onSave={onLevelAssessmentSave}
                />
              </div>
            )}
        </div>
        {area.shortDescription && (
          <span className="text-muted-foreground text-xs">
            {area.shortDescription}
          </span>
        )}
      </div>
      <div className="border-border border-r border-l">
        {area.competencies.map((item, itemIndex) => {
          const competency = area.competencies.find(
            (c) => c.title === item.title,
          );

          return (
            <CompetencyMatrixRow
              key={`${area.id}-${item.id}`}
              levels={levels}
              competency={competency as CompMatrixCompetencyWithDefinitions}
              ratingOptions={ratingOptions}
              compMatrixCurrentRating={compMatrixCurrentRating}
              phase={phase}
              viewMode={viewMode}
              onSaveCell={onSaveCell}
              compMatrixId={compMatrixId}
              referenceUserIds={referenceUserIds}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompetencyAreaSection;
