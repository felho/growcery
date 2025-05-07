"use client";

import React, { useState } from "react";
import {
  type CompetencyItem,
  type Rating,
  getRatingColor,
  experienceLevels,
  type Phase,
} from "~/data/mock-competency-data";
import CompetencyMatrixCell from "./competency-matrix-cell";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";

interface CellRating {
  employeeRating?: Rating;
  managerRating?: Rating;
  employeeNote?: string;
  managerNote?: string;
}

interface CompetencyMatrixRowProps {
  competencyName: string;
  competency: CompetencyItem;
  dbCompetency?: CompMatrixCompetencyWithDefinitions;
  phase: Phase;
  viewMode: "employee" | "manager";
  onUpdateRating: (rating: CellRating) => void;
}

const CompetencyMatrixRow: React.FC<CompetencyMatrixRowProps> = ({
  competencyName,
  competency,
  dbCompetency,
  phase,
  viewMode,
  onUpdateRating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get level-specific definition or fallback to general definition
  const getLevelDefinition = (level: string): string => {
    if (competency.levelDefinitions && competency.levelDefinitions[level]) {
      return competency.levelDefinitions[level] || "";
    }

    return competency.definition
      ? `${competency.definition} for ${level} level.`
      : `This competency evaluates the ability to effectively apply skills and knowledge in ${competencyName} at the ${level} level.`;
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      {/* Row header with competency name */}
      <div className="flex">
        <div
          className="border-border bg-muted/10 flex w-[17.55%] cursor-pointer items-center border-r p-3"
          onClick={handleToggleExpand}
        >
          <div className="flex w-full items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            )}
            <span
              className="truncate text-sm whitespace-nowrap"
              title={competencyName}
            >
              {competencyName}
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
              rating={{
                employeeRating: competency.employeeRating,
                managerRating: competency.managerRating,
                employeeNote: competency.employeeNote,
                managerNote: competency.managerNote,
              }}
              onUpdateRating={onUpdateRating}
              cellIndex={index}
              competencyDefinition={getLevelDefinition(level)}
              isExpanded={isExpanded}
              viewMode={viewMode}
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
