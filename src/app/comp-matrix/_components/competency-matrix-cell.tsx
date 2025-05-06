"use client";

import React, { useState } from "react";
import {
  type Rating,
  getRatingColor,
  mockCompetencyData,
} from "~/data/mock-competency-data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { CheckIcon, Diff, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";

interface CompetencyMatrixCellProps {
  isActive: boolean; // Keep prop for backward compatibility
  rating?: Rating;
  employeeRating?: Rating;
  managerRating?: Rating;
  note?: string;
  employeeNote?: string;
  managerNote?: string;
  onUpdateRating: (rating: Rating) => void;
  onUpdateNote: (note: string) => void;
  onUpdateEmployeeRating?: (rating: Rating) => void;
  onUpdateManagerRating?: (rating: Rating) => void;
  onUpdateEmployeeNote?: (note: string) => void;
  onUpdateManagerNote?: (note: string) => void;
  isHeatmapView?: boolean;
  cellIndex: number;
  competencyDefinition?: string;
  level?: string;
  isExpanded?: boolean;
  showBothRatings?: boolean;
  hasDifferentRatings?: boolean;
  viewMode?: "employee" | "manager" | "both";
}

const CompetencyMatrixCell: React.FC<CompetencyMatrixCellProps> = ({
  rating,
  employeeRating,
  managerRating,
  note = "",
  employeeNote = "",
  managerNote = "",
  onUpdateRating,
  onUpdateNote,
  onUpdateEmployeeRating,
  onUpdateManagerRating,
  onUpdateEmployeeNote,
  onUpdateManagerNote,
  isHeatmapView = false,
  cellIndex,
  competencyDefinition,
  level,
  isExpanded = false,
  showBothRatings = false,
  hasDifferentRatings = false,
  viewMode = "employee",
}) => {
  const [localNote, setLocalNote] = useState(note);
  const [localEmployeeNote, setLocalEmployeeNote] = useState(employeeNote);
  const [localManagerNote, setLocalManagerNote] = useState(managerNote);

  // Get available rating options from the mock data
  const ratingOptions: Rating[] = mockCompetencyData.ratingOptions;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNote(e.target.value);
  };

  const handleEmployeeNoteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setLocalEmployeeNote(e.target.value);
  };

  const handleManagerNoteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setLocalManagerNote(e.target.value);
  };

  const handleNoteSave = () => {
    onUpdateNote(localNote);
  };

  const handleEmployeeNoteSave = () => {
    if (onUpdateEmployeeNote) {
      onUpdateEmployeeNote(localEmployeeNote);
    }
  };

  const handleManagerNoteSave = () => {
    if (onUpdateManagerNote) {
      onUpdateManagerNote(localManagerNote);
    }
  };

  // Check if the cell has been rated
  const isRated = (): boolean => {
    if (showBothRatings) {
      if (viewMode === "employee") return !!employeeRating;
      if (viewMode === "manager") return !!managerRating;
      return !!employeeRating || !!managerRating;
    }
    return !!rating;
  };

  // Get rating description
  const getRatingDescription = (ratingValue: Rating): string => {
    return mockCompetencyData.ratingDescriptions[ratingValue] || "";
  };

  // Only use background colors for the heatmap view
  const cellBackground = isHeatmapView
    ? getRatingColor(rating || "Inexperienced")
    : isRated()
      ? "bg-card hover:bg-muted/30"
      : "bg-[#FFDEE2] hover:bg-red-100/70"; // Pink background for unrated cells

  // For the discussion view with both ratings (non-expanded)
  if (
    showBothRatings &&
    !isHeatmapView &&
    employeeRating &&
    managerRating &&
    !isExpanded
  ) {
    // Determine cell background color based on whether ratings differ
    const discussionCellBackground = hasDifferentRatings
      ? "bg-red-100/50 hover:bg-red-100/70"
      : "bg-card hover:bg-muted/30";

    // Render non-expanded cell for discussion view
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`border-border flex h-12 flex-1 cursor-pointer flex-col items-center justify-center border-r transition-colors last:border-r-0 ${discussionCellBackground}`}
          >
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-md px-2 py-0.5 text-xs">
                E: {employeeRating}
              </div>
              <div className="bg-secondary/30 mt-1 rounded-md px-2 py-0.5 text-xs">
                M: {managerRating}
              </div>
            </div>
            {hasDifferentRatings && (
              <div className="absolute top-0 right-0">
                <div className="h-0 w-0 border-t-8 border-r-8 border-t-red-400 border-r-transparent"></div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {competencyDefinition && (
              <p className="text-muted-foreground mb-4 text-sm">
                {competencyDefinition}
              </p>
            )}

            <Tabs defaultValue="employee" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="employee">Employee</TabsTrigger>
                <TabsTrigger value="manager">Manager</TabsTrigger>
              </TabsList>

              <TabsContent value="employee" className="space-y-4 pt-4">
                <div>
                  <h4 className="mb-2 font-medium">Rating</h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/20 rounded-md px-3 py-1 text-sm font-medium">
                      {employeeRating}
                    </span>
                    {employeeRating && (
                      <span className="text-muted-foreground text-xs">
                        {getRatingDescription(employeeRating)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <p className="text-sm">
                    {employeeNote || "No notes provided."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="manager" className="space-y-4 pt-4">
                <div>
                  <h4 className="mb-2 font-medium">Rating</h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary/30 rounded-md px-3 py-1 text-sm font-medium">
                      {managerRating}
                    </span>
                    {managerRating && (
                      <span className="text-muted-foreground text-xs">
                        {getRatingDescription(managerRating)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <p className="text-sm">
                    {managerNote || "No notes provided."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {hasDifferentRatings && (
              <div className="border-border flex items-center gap-2 border-t pt-2 text-sm text-red-500">
                <Diff className="h-4 w-4" />
                <span>Ratings differ between employee and manager</span>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Render expanded cell with definition, rating selector, and notes
  if (isExpanded && !isHeatmapView) {
    // For joint assessment (showBothRatings is true), we'll determine which rating/note to show based on viewMode
    const currentRating =
      viewMode === "manager" ? managerRating : employeeRating;
    const currentNote = viewMode === "manager" ? managerNote : employeeNote;
    const updateCurrentRating =
      viewMode === "manager" ? onUpdateManagerRating : onUpdateEmployeeRating;
    const updateCurrentNote =
      viewMode === "manager" ? onUpdateManagerNote : onUpdateEmployeeNote;

    return (
      <div className="border-border flex-1 border-r last:border-r-0">
        {/* Cell content with competency definition */}
        <div className="flex h-full flex-col p-3">
          {/* Competency definition */}
          <div className="mb-3 flex-grow">
            <p className="text-sm">{competencyDefinition}</p>
          </div>

          {/* Proficiency Radio Selector */}
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
              value={showBothRatings ? currentRating : rating}
              onValueChange={(value) => {
                if (showBothRatings) {
                  updateCurrentRating?.(value as Rating);
                } else {
                  onUpdateRating(value as Rating);
                }
              }}
              className="flex justify-between"
            >
              {ratingOptions.map((ratingOption, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <RadioGroupItem
                    value={ratingOption}
                    id={`${ratingOption}-${cellIndex}`}
                    className="border-green-500 text-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
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

            {/* Rating description */}
            {(showBothRatings ? currentRating : rating) && (
              <p className="text-muted-foreground mt-1 text-xs">
                {getRatingDescription(
                  showBothRatings
                    ? (currentRating as Rating)
                    : (rating as Rating),
                )}
              </p>
            )}
          </div>

          {/* Notes textarea */}
          <div className="mb-2">
            <Textarea
              placeholder="Add notes..."
              value={
                showBothRatings
                  ? viewMode === "manager"
                    ? localManagerNote
                    : localEmployeeNote
                  : localNote
              }
              onChange={
                showBothRatings
                  ? viewMode === "manager"
                    ? handleManagerNoteChange
                    : handleEmployeeNoteChange
                  : handleNoteChange
              }
              className="bg-background min-h-[80px] resize-none text-sm"
            />
            <div className="mt-1 flex justify-end">
              <Button
                onClick={
                  showBothRatings
                    ? viewMode === "manager"
                      ? handleManagerNoteSave
                      : handleEmployeeNoteSave
                    : handleNoteSave
                }
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
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`border-border flex h-12 flex-1 cursor-pointer items-center justify-center border-r transition-colors last:border-r-0 ${cellBackground} relative`}
        >
          {!isHeatmapView && (
            <>
              {isRated() ? (
                <span className="text-sm font-medium">{rating}</span>
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          {/* Show competency definition */}
          {competencyDefinition && (
            <p className="text-muted-foreground mb-4 text-sm">
              {competencyDefinition}
            </p>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">Rating</h4>
              {!isRated() && (
                <Badge variant="destructive" className="px-2 py-0 text-[10px]">
                  Not rated
                </Badge>
              )}
            </div>
            <div className="mb-2 flex justify-between gap-4">
              <RadioGroup
                value={rating}
                onValueChange={(value) => onUpdateRating(value as Rating)}
                className="flex w-full justify-between"
              >
                {ratingOptions.map((ratingOption, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value={ratingOption}
                      id={`popover-${ratingOption}-${cellIndex}`}
                      className="border-green-500 text-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                    />
                    <label
                      htmlFor={`popover-${ratingOption}-${cellIndex}`}
                      className="cursor-pointer text-[10px] font-medium"
                    >
                      {ratingOption.substring(0, 4)}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Rating description */}
            {rating && (
              <p className="text-muted-foreground mb-4 text-xs">
                {getRatingDescription(rating)}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium">Notes</h4>
            <Textarea
              placeholder="Add notes here..."
              value={localNote}
              onChange={handleNoteChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNoteSave}
              size="sm"
              className="flex items-center gap-1"
            >
              <CheckIcon className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompetencyMatrixCell;
