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

interface CompetencyMatrixRowProps {
  competencyName: string;
  competency: CompetencyItem;
  isHeatmapView: boolean;
  showBothRatings: boolean;
  viewMode: "employee" | "manager" | "both";
  updateEmployeeRating: (rating: Rating) => void;
  updateManagerRating: (rating: Rating) => void;
  updateEmployeeNote: (note: string) => void;
  updateManagerNote: (note: string) => void;
}

const CompetencyMatrixRow: React.FC<CompetencyMatrixRowProps> = ({
  competencyName,
  competency,
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
  const generateCellsForView = (type: "employee" | "manager" | "both") => {
    // If type is 'both', we handle it differently for the discussion view
    if (type === "both" && showBothRatings && !isExpanded) {
      return experienceLevels.map((level, index) => {
        const levelDefinition = getLevelDefinition(level);

        const hasDifferentRatings =
          competency.employeeRating !== competency.managerRating;

        return (
          <CompetencyMatrixCell
            key={index}
            isActive={false}
            employeeRating={competency.employeeRating}
            managerRating={competency.managerRating}
            note={""}
            employeeNote={competency.employeeNote}
            managerNote={competency.managerNote}
            onUpdateRating={() => {}} // Not editable in non-expanded discussion view
            onUpdateNote={() => {}} // Not editable in non-expanded discussion view
            onUpdateEmployeeRating={updateEmployeeRating}
            onUpdateManagerRating={updateManagerRating}
            onUpdateEmployeeNote={updateEmployeeNote}
            onUpdateManagerNote={updateManagerNote}
            cellIndex={index}
            competencyDefinition={levelDefinition}
            level={level}
            isExpanded={isExpanded}
            showBothRatings={showBothRatings}
            hasDifferentRatings={hasDifferentRatings}
            viewMode={viewMode}
          />
        );
      });
    }

    // For employee or manager views, or expanded joint view
    const actualType = type === "both" ? "employee" : type; // Default to employee if type is 'both'
    const rating =
      actualType === "employee"
        ? competency.employeeRating
        : competency.managerRating;
    const note =
      actualType === "employee"
        ? competency.employeeNote
        : competency.managerNote;
    const updateRating =
      actualType === "employee" ? updateEmployeeRating : updateManagerRating;
    const updateNote =
      actualType === "employee" ? updateEmployeeNote : updateManagerNote;

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
        .map((_, index) => (
          <CompetencyMatrixCell
            key={index}
            isActive={index === ratingIndex}
            rating={index === ratingIndex ? rating : "Inexperienced"}
            note={index === ratingIndex ? note : ""}
            onUpdateRating={(newRating) => updateRating(newRating)}
            onUpdateNote={(newNote) => updateNote(newNote)}
            isHeatmapView={true}
            cellIndex={index}
            competencyDefinition={getLevelDefinition(
              experienceLevels[index] ?? "",
            )}
            level={experienceLevels[index] ?? ""}
            isExpanded={isExpanded}
            viewMode={type}
          />
        ));
    }

    // For regular view (non-expanded), generate cells for each level with no active state
    return experienceLevels.map((level, index) => {
      return (
        <CompetencyMatrixCell
          key={index}
          isActive={false}
          rating={rating}
          note={note}
          onUpdateRating={updateRating}
          onUpdateNote={updateNote}
          cellIndex={index}
          competencyDefinition={getLevelDefinition(level)}
          level={level}
          isExpanded={false}
          viewMode={type}
        />
      );
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
          {viewMode === "both" && generateCellsForView("both")}
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
              // For both employee and manager views (including joint assessment)
              const hasDifferentRatings =
                competency.employeeRating !== competency.managerRating;
              const customDefinition = getLevelDefinition(level);

              // For joint assessment view, we'll pass the current viewMode for expanded view
              // The CompetencyMatrixCell component will handle showing the appropriate rating/note based on viewMode
              if (viewMode === "both" && showBothRatings) {
                return (
                  <CompetencyMatrixCell
                    key={index}
                    isActive={false}
                    employeeRating={competency.employeeRating}
                    managerRating={competency.managerRating}
                    employeeNote={competency.employeeNote}
                    managerNote={competency.managerNote}
                    onUpdateRating={() => {}}
                    onUpdateNote={() => {}}
                    onUpdateEmployeeRating={updateEmployeeRating}
                    onUpdateManagerRating={updateManagerRating}
                    onUpdateEmployeeNote={updateEmployeeNote}
                    onUpdateManagerNote={updateManagerNote}
                    cellIndex={index}
                    competencyDefinition={customDefinition}
                    level={level}
                    isExpanded={true}
                    showBothRatings={showBothRatings}
                    hasDifferentRatings={hasDifferentRatings}
                    viewMode={viewMode}
                  />
                );
              }

              // For employee or manager views
              const rating =
                viewMode === "employee"
                  ? competency.employeeRating
                  : competency.managerRating;
              const note =
                viewMode === "employee"
                  ? competency.employeeNote
                  : competency.managerNote;
              const updateRating =
                viewMode === "employee"
                  ? updateEmployeeRating
                  : updateManagerRating;
              const updateNote =
                viewMode === "employee"
                  ? updateEmployeeNote
                  : updateManagerNote;

              return (
                <CompetencyMatrixCell
                  key={index}
                  isActive={false}
                  rating={rating}
                  note={note}
                  onUpdateRating={updateRating}
                  onUpdateNote={updateNote}
                  cellIndex={index}
                  competencyDefinition={customDefinition}
                  level={level}
                  isExpanded={true}
                  viewMode={viewMode}
                />
              );
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
