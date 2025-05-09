import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { CheckIcon, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { type Rating } from "~/data/mock-competency-data";
import type { CompMatrixRatingOption } from "~/server/queries/comp-matrix-rating-option";

interface DefaultPopoverProps {
  rating?: string;
  note?: string;
  competencyDefinition?: string;
  isRated: boolean;
  phase: string;
  cellBackground: string;
  cellIndex: number;
  ratingOptions: CompMatrixRatingOption[];
  onRatingChange: (rating: Rating) => void;
  onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
}

const DefaultPopover: React.FC<DefaultPopoverProps> = ({
  rating,
  note,
  competencyDefinition,
  isRated,
  phase,
  cellBackground,
  cellIndex,
  ratingOptions,
  onRatingChange,
  onNoteChange,
  onSave,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`border-border flex h-12 flex-1 cursor-pointer items-center justify-center border-r transition-colors last:border-r-0 ${cellBackground} relative`}
        >
          {phase !== "calibration" && (
            <>
              {isRated ? (
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
          {competencyDefinition && (
            <p className="text-muted-foreground mb-4 text-sm">
              {competencyDefinition}
            </p>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">Rating</h4>
              {!isRated && (
                <Badge variant="destructive" className="px-2 py-0 text-[10px]">
                  Not rated
                </Badge>
              )}
            </div>
            <div className="mb-2 flex justify-between gap-4">
              <RadioGroup
                value={rating}
                onValueChange={onRatingChange}
                className="flex w-full justify-between"
              >
                {ratingOptions.map((ratingOption, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value={ratingOption.title}
                      id={`popover-${ratingOption.title}-${cellIndex}`}
                      className="border-green-500 text-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!bg-green-500 [&_[data-slot=radio-group-indicator]]:hidden"
                    />
                    <label
                      htmlFor={`popover-${ratingOption.title}-${cellIndex}`}
                      className="cursor-pointer text-[10px] font-medium"
                    >
                      {ratingOption.radioButtonLabel}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Notes</h4>
            <Textarea
              placeholder="Add notes here..."
              value={note || ""}
              onChange={onNoteChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onSave}
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

export default DefaultPopover;
