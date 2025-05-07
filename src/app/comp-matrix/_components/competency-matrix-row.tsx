"use client";

import React, { useState } from "react";
import {
  type CompetencyItem,
  type Rating,
  getRatingColor,
  experienceLevels,
} from "~/data/mock-competency-data";
import CompetencyMatrixCell from "./competency-matrix-cell";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CompMatrixCompetencyWithDefinitions } from "~/server/queries/comp-matrix-competency";

interface CompetencyMatrixRowProps {
  competencyName: string;
  competency: CompetencyItem;
  dbCompetency?: CompMatrixCompetencyWithDefinitions;
  phase: "assessment" | "discussion" | "calibration";
  isHeatmapView: boolean;
  showBothRatings: boolean;
  viewMode: "employee" | "manager";
  updateEmployeeRating: (rating: Rating) => void;
  updateManagerRating: (rating: Rating) => void;
  updateEmployeeNote: (note: string) => void;
  updateManagerNote: (note: string) => void;
}

const CompetencyMatrixRow: React.FC<CompetencyMatrixRowProps> = ({
  competencyName,
  competency,
  dbCompetency,
  phase,
  isHeatmapView,
  showBothRatings,
  viewMode,
  updateEmployeeRating,
  updateManagerRating,
  updateEmployeeNote,
  updateManagerNote,
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

  // Generate cells for the view (employee or manager)
  const generateCellsForView = (type: "employee" | "manager") => {
    // For discussion phase with different ratings, show both ratings
    if (phase === "discussion" && !isExpanded) {
      const hasDifferentRatings =
        competency.employeeRating !== competency.managerRating;

      if (hasDifferentRatings) {
        return experienceLevels.map((level, index) => {
          const levelDefinition = getLevelDefinition(level);

          // Calculate parameters for CompetencyMatrixCell
          const cellParams = {
            isActive: false,
            employeeRating: competency.employeeRating,
            managerRating: competency.managerRating,
            note: "",
            employeeNote: competency.employeeNote,
            managerNote: competency.managerNote,
            onUpdateRating: () => {}, // Not editable in non-expanded discussion view
            onUpdateNote: () => {}, // Not editable in non-expanded discussion view
            onUpdateEmployeeRating: updateEmployeeRating,
            onUpdateManagerRating: updateManagerRating,
            onUpdateEmployeeNote: updateEmployeeNote,
            onUpdateManagerNote: updateManagerNote,
            cellIndex: index,
            competencyDefinition: levelDefinition,
            level: level,
            isExpanded: isExpanded,
            hasDifferentRatings: true,
            viewMode: type,
            phase: phase,
          };

          return <CompetencyMatrixCell key={index} {...cellParams} />;
        });
      }
    }

    // For regular view (non-expanded), generate cells for each level
    const rating =
      type === "employee"
        ? competency.employeeRating
        : competency.managerRating;
    const note =
      type === "employee" ? competency.employeeNote : competency.managerNote;
    const updateRating =
      type === "employee" ? updateEmployeeRating : updateManagerRating;
    const updateNote =
      type === "employee" ? updateEmployeeNote : updateManagerNote;

    // For heatmap view, we only show one cell that corresponds to the rating
    if (isHeatmapView) {
      // Get the index based on the available rating options
      const ratingToIndexMap: Record<Rating, number> = {
        Inexperienced: 0,
        Novice: 1,
        Intermediate: 2,
        Proficient: 3,
      };

      const ratingIndex = ratingToIndexMap[rating] || 0;

      return Array(experienceLevels.length)
        .fill(null)
        .map((_, index) => {
          // Calculate parameters for CompetencyMatrixCell
          const cellParams = {
            isActive: index === ratingIndex,
            rating: index === ratingIndex ? rating : "Inexperienced",
            note: index === ratingIndex ? note : "",
            onUpdateRating: (newRating: Rating) => updateRating(newRating),
            onUpdateNote: (newNote: string) => updateNote(newNote),
            isHeatmapView: true,
            cellIndex: index,
            competencyDefinition: getLevelDefinition(
              experienceLevels[index] ?? "",
            ),
            level: experienceLevels[index] ?? "",
            isExpanded: isExpanded,
            viewMode: type,
            phase: phase,
          };

          return <CompetencyMatrixCell key={index} {...cellParams} />;
        });
    }

    // For regular view (non-expanded), generate cells for each level with no active state
    return experienceLevels.map((level, index) => {
      // Calculate parameters for CompetencyMatrixCell
      const cellParams = {
        isActive: false,
        rating: rating,
        note: note,
        onUpdateRating: updateRating,
        onUpdateNote: updateNote,
        cellIndex: index,
        competencyDefinition: getLevelDefinition(level),
        level: level,
        isExpanded: false,
        viewMode: type,
        phase: phase,
      };

      return <CompetencyMatrixCell key={index} {...cellParams} />;
    });
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
          {viewMode === "employee" && generateCellsForView("employee")}
          {viewMode === "manager" && generateCellsForView("manager")}
        </div>
      </div>

      {/* Expanded view */}
      {isExpanded && !isHeatmapView && (
        <div
          className="border-border flex border-b"
          style={{ minHeight: "200px" }}
        >
          <div className="border-border bg-muted/5 w-[17.55%] border-r p-3"></div>
          <div className="flex flex-1">
            {/* For expanded view, create definitions with expandable content */}
            {experienceLevels.map((level, index) => {
              const hasDifferentRatings =
                competency.employeeRating !== competency.managerRating;
              const customDefinition = getLevelDefinition(level);

              // Calculate parameters for CompetencyMatrixCell
              const cellParams = {
                isActive: false,
                rating:
                  viewMode === "employee"
                    ? competency.employeeRating
                    : competency.managerRating,
                note:
                  viewMode === "employee"
                    ? competency.employeeNote
                    : competency.managerNote,
                onUpdateRating:
                  viewMode === "employee"
                    ? updateEmployeeRating
                    : updateManagerRating,
                onUpdateNote:
                  viewMode === "employee"
                    ? updateEmployeeNote
                    : updateManagerNote,
                cellIndex: index,
                competencyDefinition: customDefinition,
                level: level,
                isExpanded: true,
                viewMode: viewMode,
                phase: phase,
              };

              return <CompetencyMatrixCell key={index} {...cellParams} />;
            })}
          </div>
        </div>
      )}

      {/* If expanded with heatmap view, show message */}
      {isExpanded && isHeatmapView && (
        <div className="bg-muted/5 border-border border-t p-4">
          <div className="text-center text-sm">
            Expanded view is not available in heatmap mode
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetencyMatrixRow;
