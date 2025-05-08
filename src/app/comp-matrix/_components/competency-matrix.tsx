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
import type { Phase, CompetencyCategory } from "~/data/mock-competency-data";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
import type { CompMatrixRatingsForUIMap } from "~/server/queries/comp-matrix-current-rating";

interface CompetencyMatrixProps {
  competencyData: {
    competencies: CompetencyCategory[];
    levels: any[];
  };
  phase: Phase;
  viewMode: "employee" | "manager";
  selectedEmployee: string;
  compMatrix?: CompMatrixWithFullRelations;
  ratingOptions?: CompMatrixRatingOption[];
  compMatrixCurrentRating?: CompMatrixRatingsForUIMap;
  getCurrentEmployee: () => any;
  getCurrentOrgUnit: () => any;
  getCurrentFunction: () => any;
  switchPhase: (phase: Phase) => void;
  updateCompetency: (
    categoryIndex: number,
    itemIndex: number,
    rating: any,
  ) => void;
}

export const CompetencyMatrix = ({
  competencyData,
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
  updateCompetency,
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
              {getCurrentEmployee()?.position || ""}
              {getCurrentOrgUnit() && ` - ${getCurrentOrgUnit()?.name}`}
              {getCurrentFunction() && ` - ${getCurrentFunction()?.name}`}
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
            <CompetencyMatrixHeader levels={competencyData.levels} />

            {compMatrix?.areas?.map((area) => {
              const category = competencyData.competencies.find(
                (c: CompetencyCategory) => c.category === area.title,
              );
              if (!category) return null;

              return (
                <CompetencyAreaSection
                  key={area.id}
                  area={area}
                  ratingOptions={ratingOptions}
                  compMatrixCurrentRating={compMatrixCurrentRating}
                  category={category}
                  phase={phase}
                  viewMode={viewMode}
                  updateCompetency={updateCompetency}
                  categoryIndex={competencyData.competencies.indexOf(category)}
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
