"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import type { LevelAssessment } from "~/zod-schemas/comp-matrix-level-assessments";

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
  levelAssessments?: LevelAssessment[];
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
}: CompetencyMatrixProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {getCurrentEmployee()?.name
                ? `${getCurrentEmployee()?.name}'s Competency Assessment`
                : "Competency Assessment"}
            </CardTitle>
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
      </CardHeader>
      <CardContent>
        {selectedEmployee ? (
          <div className="border-border overflow-hidden rounded-md border">
            <CompetencyMatrixHeader levels={compMatrix?.levels ?? []} />

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
