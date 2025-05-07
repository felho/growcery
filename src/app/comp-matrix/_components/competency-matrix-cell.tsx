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

interface CellRating {
  employeeRating?: Rating;
  managerRating?: Rating;
  employeeNote?: string;
  managerNote?: string;
}

interface CompetencyMatrixCellProps {
  phase: "assessment" | "discussion" | "calibration";
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

  // Determine if ratings are different in discussion phase
  const hasDifferentRatings =
    phase === "discussion" &&
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

  // For the discussion view with different ratings
  if (hasDifferentRatings && !isExpanded) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`border-border flex h-12 flex-1 cursor-pointer flex-col items-center justify-center border-r bg-red-100/50 transition-colors last:border-r-0 hover:bg-red-100/70`}
          >
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-md px-2 py-0.5 text-xs">
                E: {rating.employeeRating}
              </div>
              <div className="bg-secondary/30 mt-1 rounded-md px-2 py-0.5 text-xs">
                M: {rating.managerRating}
              </div>
            </div>
            <div className="absolute top-0 right-0">
              <div className="h-0 w-0 border-t-8 border-r-8 border-t-red-400 border-r-transparent"></div>
            </div>
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
                      {rating.employeeRating}
                    </span>
                    {rating.employeeRating && (
                      <span className="text-muted-foreground text-xs">
                        {getRatingDescription(rating.employeeRating)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <p className="text-sm">
                    {rating.employeeNote || "No notes provided."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="manager" className="space-y-4 pt-4">
                <div>
                  <h4 className="mb-2 font-medium">Rating</h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary/30 rounded-md px-3 py-1 text-sm font-medium">
                      {rating.managerRating}
                    </span>
                    {rating.managerRating && (
                      <span className="text-muted-foreground text-xs">
                        {getRatingDescription(rating.managerRating)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <p className="text-sm">
                    {rating.managerNote || "No notes provided."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
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
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`border-border flex h-12 flex-1 cursor-pointer items-center justify-center border-r transition-colors last:border-r-0 ${cellBackground} relative`}
        >
          {phase !== "calibration" && (
            <>
              {isRated() ? (
                <span className="text-sm font-medium">
                  {getCurrentRating()}
                </span>
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </>
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
                value={getCurrentRating()}
                onValueChange={handleRatingChange}
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

            {getCurrentRating() && (
              <p className="text-muted-foreground mb-4 text-xs">
                {getRatingDescription(getCurrentRating()!)}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium">Notes</h4>
            <Textarea
              placeholder="Add notes here..."
              value={getCurrentNote() || ""}
              onChange={handleNoteChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
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
