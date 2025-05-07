import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { type Rating } from "~/data/mock-competency-data";

interface DiscussionPopoverProps {
  employeeRating?: Rating;
  managerRating?: Rating;
  employeeNote?: string;
  managerNote?: string;
  competencyDefinition?: string;
  getRatingDescription: (rating: Rating) => string;
}

const DiscussionPopover: React.FC<DiscussionPopoverProps> = ({
  employeeRating,
  managerRating,
  employeeNote,
  managerNote,
  competencyDefinition,
  getRatingDescription,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`border-border flex h-12 flex-1 cursor-pointer flex-col items-center justify-center border-r bg-red-100/50 transition-colors last:border-r-0 hover:bg-red-100/70`}
        >
          <div className="flex flex-col items-center">
            <div className="bg-primary/20 rounded-md px-2 py-0.5 text-xs">
              E: {employeeRating}
            </div>
            <div className="bg-secondary/30 mt-1 rounded-md px-2 py-0.5 text-xs">
              M: {managerRating}
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
                <p className="text-sm">{managerNote || "No notes provided."}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DiscussionPopover;
