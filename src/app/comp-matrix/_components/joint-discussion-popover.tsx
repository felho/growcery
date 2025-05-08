import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { CompMatrixRatingsForUI } from "~/server/queries/comp-matrix-current-rating";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";

interface DiscussionPopoverProps {
  competencyDefinition?: string;
  currentRating: CompMatrixRatingsForUI | undefined;
  ratingOptions: CompMatrixRatingOption[] | undefined;
}

const DiscussionPopover: React.FC<DiscussionPopoverProps> = ({
  competencyDefinition,
  currentRating,
  ratingOptions,
}) => {
  const getCurrentRating = (
    currentRating: CompMatrixRatingsForUI | undefined,
    ratingOptions: CompMatrixRatingOption[] | undefined,
    viewMode: "employee" | "manager",
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
    viewMode: "employee" | "manager",
  ): string | undefined => {
    if (!currentRating) return undefined;

    return viewMode === "manager"
      ? (currentRating.managerComment ?? undefined)
      : (currentRating.selfComment ?? undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`border-border flex h-12 flex-1 cursor-pointer flex-col items-center justify-center border-r bg-red-100/50 transition-colors last:border-r-0 hover:bg-red-100/70`}
        >
          <div className="flex flex-col items-center">
            <div className="bg-primary/20 rounded-md px-2 py-0.5 text-xs">
              E: {getCurrentRating(currentRating, ratingOptions, "employee")}
            </div>
            <div className="bg-secondary/30 mt-1 rounded-md px-2 py-0.5 text-xs">
              M: {getCurrentRating(currentRating, ratingOptions, "manager")}
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
                    {getCurrentRating(currentRating, ratingOptions, "employee")}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Notes</h4>
                <p className="text-sm">
                  {getCurrentNote(currentRating, "employee") ||
                    "No notes provided."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="manager" className="space-y-4 pt-4">
              <div>
                <h4 className="mb-2 font-medium">Rating</h4>
                <div className="flex items-center gap-2">
                  <span className="bg-secondary/30 rounded-md px-3 py-1 text-sm font-medium">
                    {getCurrentRating(currentRating, ratingOptions, "manager")}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Notes</h4>
                <p className="text-sm">
                  {getCurrentNote(currentRating, "manager") ||
                    "No notes provided."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DiscussionPopover;
