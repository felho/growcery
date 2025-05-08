"use client";

import React, { useState } from "react";
import {
  type Rating,
  getRatingColor,
  mockCompetencyData,
  type Phase,
} from "~/data/mock-competency-data";
import { Button } from "~/components/ui/button";
import { CheckIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import JointDiscussionPopover from "./joint-discussion-popover";
import RatingPopover from "./rating-popover";
import type { CompMatrixRatingsForUI } from "~/server/queries/comp-matrix-current-rating";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";
interface CellRating {
  employeeRating?: Rating;
  managerRating?: Rating;
  employeeNote?: string;
  managerNote?: string;
}

interface CompetencyMatrixCellProps {
  phase: Phase;
  isActive: boolean;
  rating: CellRating;
  onUpdateRating: (rating: CellRating) => void;
  cellIndex: number;
  competencyDefinition?: string;
  dbRatingOptions?: CompMatrixRatingOption[];
  currentRating?: CompMatrixRatingsForUI;
  isExpanded?: boolean;
  hasDifferentRatings?: boolean;
  viewMode?: "employee" | "manager";
}

const CompetencyMatrixCell: React.FC<CompetencyMatrixCellProps> = ({
  phase,
  rating,
  onUpdateRating,
  cellIndex,
  competencyDefinition,
  dbRatingOptions,
  currentRating,
  isExpanded = false,
  viewMode = "employee",
}) => {
  const [localRating, setLocalRating] = useState<CellRating>(rating);

  // Get available rating options from the mock data
  const ratingOptions: Rating[] = mockCompetencyData.ratingOptions;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    setLocalRating((prev) => ({
      ...prev,
      [viewMode === "manager" ? "managerNote" : "employeeNote"]: newNote,
    }));
  };

  const handleRatingChange = (newRating: Rating) => {
    const updatedRating = {
      ...localRating,
      [viewMode === "manager" ? "managerRating" : "employeeRating"]: newRating,
    };
    setLocalRating(updatedRating);
    onUpdateRating(updatedRating);
  };

  const handleSave = () => {
    onUpdateRating(localRating);
  };

  // Check if the cell has been rated
  const isRated = (
    currentRating: CompMatrixRatingsForUI | undefined,
  ): boolean => {
    if (!currentRating) return false;

    if (viewMode === "manager") {
      return currentRating.managerRatingId !== null;
    } else {
      return currentRating.selfRatingId !== null;
    }
  };

  // Get rating description
  const getRatingDescription = (ratingValue: Rating): string => {
    return mockCompetencyData.ratingDescriptions[ratingValue] || "";
  };

  // Get current rating based on view mode
  const getCurrentRating = (
    currentRating: CompMatrixRatingsForUI | undefined,
    ratingOptions: CompMatrixRatingOption[] | undefined,
  ): string | undefined => {
    if (!currentRating || !ratingOptions) return undefined;

    const ratingId =
      viewMode === "manager"
        ? currentRating.managerRatingId
        : currentRating.selfRatingId;

    const ratingOption = ratingOptions.find((option) => option.id === ratingId);

    if (!ratingOption) return undefined;

    return ratingOption.title;
  };

  // Get current note based on view mode
  const getCurrentNote = (
    currentRating: CompMatrixRatingsForUI | undefined,
  ): string | undefined => {
    if (!currentRating) return undefined;

    return viewMode === "manager"
      ? (currentRating.managerComment ?? undefined)
      : (currentRating.selfComment ?? undefined);
  };

  // Determine if ratings are different in joint-discussion phase
  const hasDifferentRatings =
    phase === "joint-discussion" &&
    currentRating &&
    currentRating.managerRatingId &&
    currentRating.selfRatingId &&
    currentRating.managerRatingId !== currentRating.selfRatingId;

  // Only use background colors for the calibration phase
  const cellBackground =
    phase === "calibration"
      ? getRatingColor(
          getCurrentRating(currentRating, dbRatingOptions) || "Inexperienced",
        )
      : isRated(currentRating)
        ? "bg-card hover:bg-muted/30"
        : "bg-[#FFDEE2] hover:bg-red-100/70";

  // For the joint-discussion view with different ratings
  if (hasDifferentRatings && !isExpanded) {
    return (
      <JointDiscussionPopover
        employeeRating={rating.employeeRating}
        managerRating={rating.managerRating}
        employeeNote={rating.employeeNote}
        managerNote={rating.managerNote}
        competencyDefinition={competencyDefinition}
        getRatingDescription={getRatingDescription}
      />
    );
  }

  // Render expanded cell with definition, rating selector, and notes
  if (isExpanded && phase !== "calibration") {
    return (
      <div className="border-border flex-1 border-r last:border-r-0">
        <div className="flex h-full flex-col p-3">
          <div className="mb-3 flex-grow">
            <p className="text-sm">{competencyDefinition}</p>
          </div>

          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">Rating</h4>
              {!isRated(currentRating) && (
                <Badge variant="destructive" className="px-2 py-0 text-[10px]">
                  Not rated
                </Badge>
              )}
            </div>
            <RadioGroup
              value={getCurrentRating(currentRating, dbRatingOptions)}
              onValueChange={handleRatingChange}
              className="flex justify-between gap-1"
            >
              {dbRatingOptions?.map((ratingOption, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <RadioGroupItem
                    value={ratingOption.title}
                    id={`${ratingOption.title}-${cellIndex}`}
                    className="border-green-500 text-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!bg-green-500 [&_[data-slot=radio-group-indicator]]:hidden"
                  />
                  <label
                    htmlFor={`${ratingOption.title}-${cellIndex}`}
                    className="cursor-pointer text-[10px] font-medium"
                  >
                    {ratingOption.radioButtonLabel}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="mb-2">
            <Textarea
              placeholder="Add notes..."
              value={getCurrentNote(currentRating) || ""}
              onChange={handleNoteChange}
              className="bg-background min-h-[80px] resize-none text-sm"
            />
            <div className="mt-1 flex justify-end">
              <Button
                onClick={handleSave}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
              >
                <CheckIcon className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render normal cell (non-expanded) with popover
  return (
    <RatingPopover
      rating={getCurrentRating(currentRating, dbRatingOptions) as Rating}
      note={getCurrentNote(currentRating)}
      competencyDefinition={competencyDefinition}
      isRated={isRated(currentRating)}
      phase={phase}
      cellBackground={cellBackground}
      cellIndex={cellIndex}
      ratingOptions={ratingOptions}
      getRatingDescription={getRatingDescription}
      onRatingChange={handleRatingChange}
      onNoteChange={handleNoteChange}
      onSave={handleSave}
    />
  );
};

export default CompetencyMatrixCell;
