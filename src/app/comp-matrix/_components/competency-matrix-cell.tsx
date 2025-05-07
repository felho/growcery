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
  const isRated = (): boolean => {
    return viewMode === "manager"
      ? !!rating.managerRating
      : !!rating.employeeRating;
  };

  // Get rating description
  const getRatingDescription = (ratingValue: Rating): string => {
    return mockCompetencyData.ratingDescriptions[ratingValue] || "";
  };

  // Get current rating based on view mode
  const getCurrentRating = (): Rating | undefined => {
    return viewMode === "manager"
      ? rating.managerRating
      : rating.employeeRating;
  };

  // Get current note based on view mode
  const getCurrentNote = (): string | undefined => {
    return viewMode === "manager" ? rating.managerNote : rating.employeeNote;
  };

  // Determine if ratings are different in joint-discussion phase
  const hasDifferentRatings =
    phase === "joint-discussion" &&
    rating.employeeRating &&
    rating.managerRating &&
    rating.employeeRating !== rating.managerRating;

  // Only use background colors for the calibration phase
  const cellBackground =
    phase === "calibration"
      ? getRatingColor(getCurrentRating() || "Inexperienced")
      : isRated()
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
              {!isRated() && (
                <Badge variant="destructive" className="px-2 py-0 text-[10px]">
                  Not rated
                </Badge>
              )}
            </div>
            <RadioGroup
              value={getCurrentRating()}
              onValueChange={handleRatingChange}
              className="flex justify-between gap-1"
            >
              {ratingOptions.map((ratingOption, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <RadioGroupItem
                    value={ratingOption}
                    id={`${ratingOption}-${cellIndex}`}
                    className="border-green-500 text-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!bg-green-500 [&_[data-slot=radio-group-indicator]]:hidden"
                  />
                  <label
                    htmlFor={`${ratingOption}-${cellIndex}`}
                    className="cursor-pointer text-[10px] font-medium"
                  >
                    {ratingOption.substring(0, 4)}
                  </label>
                </div>
              ))}
            </RadioGroup>

            {getCurrentRating() && (
              <p className="text-muted-foreground mt-1 text-xs">
                {getRatingDescription(getCurrentRating()!)}
              </p>
            )}
          </div>

          <div className="mb-2">
            <Textarea
              placeholder="Add notes..."
              value={getCurrentNote() || ""}
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
      rating={getCurrentRating()}
      note={getCurrentNote()}
      competencyDefinition={competencyDefinition}
      isRated={isRated()}
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
