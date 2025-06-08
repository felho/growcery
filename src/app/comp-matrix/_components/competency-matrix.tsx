"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CompetencyMatrixHeader from "./competency-matrix-header";
import CompetencyAreaSection from "./competency-area-section";
import type { Phase, ViewMode } from "./types";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
import type {
  CompMatrixCellSavePayloadUI,
  CompMatrixRatingsForUIMap,
} from "~/server/queries/comp-matrix-current-rating";
import type { CompMatrixLevelAssessment } from "~/zod-schemas/comp-matrix-level-assessment";
import { LevelAssessmentBadge } from "./level-assessment-badge";

interface CompetencyMatrixProps {
  phase: Phase;
  viewMode: ViewMode;
  selectedEmployee: string;
  compMatrix?: CompMatrixWithFullRelations;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  getCurrentEmployee: () => any;
  getCurrentOrgUnit: () => any;
  getCurrentFunction: () => any;
  switchPhase: (phase: Phase) => void;
  onSaveCell: (uiPayload: CompMatrixCellSavePayloadUI) => Promise<void>;
  referenceUserIds: number[];
  userCompMatrixAssignmentId?: number;
  levelAssessments?: CompMatrixLevelAssessment[];
  onLevelAssessmentSave?: () => void;
}

export const CompetencyMatrix = ({
  phase,
  viewMode,
  selectedEmployee,
  compMatrix,
  ratingOptions,
  compMatrixCurrentRating,
  getCurrentEmployee,
  getCurrentOrgUnit,
  getCurrentFunction,
  switchPhase,
  onSaveCell,
  referenceUserIds,
  userCompMatrixAssignmentId,
  levelAssessments,
  onLevelAssessmentSave,
}: CompetencyMatrixProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>
                {getCurrentEmployee()?.fullName
                  ? `${getCurrentEmployee()?.fullName}'s Competency Assessment`
                  : "Competency Assessment"}
              </span>
              {phase === "calibration" &&
                viewMode === "manager" &&
                userCompMatrixAssignmentId &&
                compMatrix && (
                  <div className="-mt-[2px]">
                    <LevelAssessmentBadge
                      userCompMatrixAssignmentId={userCompMatrixAssignmentId}
                      compMatrixId={compMatrix.id}
                      isGeneral={true}
                      compMatrixAreaId={undefined}
                      initialMainLevel={
                        levelAssessments?.find((a) => a.isGeneral)?.mainLevel
                      }
                      initialSubLevel={
                        levelAssessments?.find((a) => a.isGeneral)?.subLevel
                      }
                      maxLevel={compMatrix.levels.length}
                      onSave={onLevelAssessmentSave}
                    />
                  </div>
                )}
            </div>
            <Tabs
              defaultValue="assessment"
              value={phase}
              onValueChange={(value) => switchPhase(value as any)}
            >
              <TabsList>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="joint-discussion">
                  Joint Discussion
                </TabsTrigger>
                <TabsTrigger value="calibration">Calibration</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            {getCurrentFunction()?.name}
            {getCurrentFunction() &&
              getCurrentOrgUnit() &&
              ` - ${getCurrentOrgUnit()?.name}`}
            {(getCurrentFunction() || getCurrentOrgUnit()) &&
              getCurrentEmployee()?.archetype &&
              ` - ${getCurrentEmployee()?.archetype.name}`}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {selectedEmployee ? (
          <div className="border-border overflow-hidden rounded-md border">
            <CompetencyMatrixHeader levels={compMatrix?.levels ?? []} compMatrix={compMatrix} />

            {compMatrix?.areas?.map((area) => {
              return (
                <CompetencyAreaSection
                  key={area.id}
                  levels={compMatrix?.levels ?? []}
                  area={area}
                  ratingOptions={ratingOptions}
                  compMatrixCurrentRating={compMatrixCurrentRating}
                  phase={phase}
                  viewMode={viewMode}
                  onSaveCell={onSaveCell}
                  compMatrixId={compMatrix?.id}
                  referenceUserIds={referenceUserIds}
                  userCompMatrixAssignmentId={userCompMatrixAssignmentId}
                  levelAssessments={levelAssessments}
                  onLevelAssessmentSave={onLevelAssessmentSave}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            Please select a function, team, and employee to view competency
            assessment
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetencyMatrix;
