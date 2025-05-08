"use client";

import React, { useEffect, useState } from "react";
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

interface CompetencyMatrixCellProps {
  phase: Phase;
  isActive: boolean;
  onUpdateRating: (rating: CompMatrixRatingsForUI) => Promise<void>;
  cellIndex: number;
  competencyDefinition?: string;
  dbRatingOptions: CompMatrixRatingOption[];
  currentRating: CompMatrixRatingsForUI;
  isExpanded: boolean;
  hasDifferentRatings?: boolean;
  viewMode?: "employee" | "manager";
}

const CompetencyMatrixCell: React.FC<CompetencyMatrixCellProps> = ({
  phase,
  onUpdateRating,
  cellIndex,
  competencyDefinition,
  dbRatingOptions,
  currentRating,
  isExpanded = false,
  viewMode = "employee",
}) => {
  const emptyRating: CompMatrixRatingsForUI = {
    selfRatingId: undefined,
    selfComment: null,
    selfRatingUpdatedAt: new Date(),
    managerId: null,
    managerRatingId: undefined,
    managerComment: null,
    managerRatingUpdatedAt: new Date(),
  };

  const [localRating, setLocalRating] = useState<CompMatrixRatingsForUI>(
    currentRating ?? emptyRating,
  );

  useEffect(() => {
    setLocalRating(currentRating ?? emptyRating);
  }, [currentRating]);

  // Get available rating options from the mock data
  const ratingOptions: Rating[] = mockCompetencyData.ratingOptions;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;

    setLocalRating((prev) => ({
      ...prev,
      [viewMode === "manager" ? "managerComment" : "selfComment"]: newNote,
    }));
  };

  const handleRatingChange = async (newTitle: string) => {
    const previous = localRating;

    const selectedOption = dbRatingOptions.find(
      (opt) => opt.title === newTitle,
    );
    if (!selectedOption) return;

    const updatedRating: CompMatrixRatingsForUI = {
      ...localRating,
      [viewMode === "manager" ? "managerRatingId" : "selfRatingId"]:
        selectedOption.id,
    };

    setLocalRating(updatedRating); // optimistic UI

    try {
      await onUpdateRating(updatedRating); // saving to db
    } catch (error) {
      console.error("Saving error:", error);
      setLocalRating(previous); // rollback, if error
    }
  };

  const handleSave = async () => {
    const previous = localRating;

    try {
      await onUpdateRating(localRating); // háttér mentés
    } catch (error) {
      console.error("Mentési hiba:", error);
      setLocalRating(previous); // rollback, ha gond van
    }
  };

  const isRated =
    viewMode === "manager"
      ? localRating.managerRatingId != null
      : localRating.selfRatingId != null;

  // Get rating description
  const getRatingDescription = (ratingValue: Rating): string => {
    return mockCompetencyData.ratingDescriptions[ratingValue] || "";
  };

  const currentRatingId =
    viewMode === "manager"
      ? localRating.managerRatingId
      : localRating.selfRatingId;

  const currentRatingOption = dbRatingOptions?.find(
    (option) => option.id === currentRatingId,
  );

  const currentRatingTitle = currentRatingOption?.title;

  const currentComment =
    viewMode === "manager"
      ? (localRating.managerComment ?? "")
      : (localRating.selfComment ?? "");

  // Determine if ratings are different in joint-discussion phase
  const hasDifferentRatings =
    phase === "joint-discussion" &&
    localRating &&
    localRating.managerRatingId &&
    localRating.selfRatingId &&
    localRating.managerRatingId !== localRating.selfRatingId;

  // Only use background colors for the calibration phase
  const cellBackground =
    phase === "calibration"
      ? getRatingColor(currentRatingTitle || "Inexperienced")
      : isRated
        ? "bg-card hover:bg-muted/30"
        : "bg-[#FFDEE2] hover:bg-red-100/70";

  return (
    <div className="border-border flex-1 border-r last:border-r-0">
      <div className="flex h-full flex-col">
        {/* Popover trigger cella */}
        <div className="h-12 w-full">
          {hasDifferentRatings ? (
            <JointDiscussionPopover
              competencyDefinition={competencyDefinition}
              currentRating={localRating}
              ratingOptions={dbRatingOptions}
            />
          ) : (
            <RatingPopover
              rating={currentRatingTitle || "Inexperienced"}
              note={currentComment}
              competencyDefinition={competencyDefinition}
              isRated={isRated}
              phase={phase}
              cellBackground={cellBackground}
              cellIndex={cellIndex}
              ratingOptions={ratingOptions}
              getRatingDescription={getRatingDescription}
              onRatingChange={handleRatingChange}
              onNoteChange={handleNoteChange}
              onSave={handleSave}
            />
          )}
        </div>

        {isExpanded && phase !== "calibration" && (
          <div className="flex flex-1 flex-col p-3">
            <div className="mb-3 flex-grow">
              <p className="text-sm">{competencyDefinition}</p>
            </div>

            <div className="mb-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">Rating</h4>
                {!isRated && (
                  <Badge
                    variant="destructive"
                    className="px-2 py-0 text-[10px]"
                  >
                    Not rated
                  </Badge>
                )}
              </div>
              <RadioGroup
                value={currentRatingTitle}
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
                value={currentComment}
                onChange={handleNoteChange}
                className="bg-background h-[120px] resize-none text-sm break-words break-all"
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
        )}
      </div>
    </div>
  );
};

export default CompetencyMatrixCell;
