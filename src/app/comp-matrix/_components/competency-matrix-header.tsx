"use client";

import React from "react";

interface CompetencyMatrixHeaderProps {
  levels: string[];
  showBothRatings: boolean;
}

const CompetencyMatrixHeader: React.FC<CompetencyMatrixHeaderProps> = ({
  levels,
  showBothRatings,
}) => {
  return (
    <div className="border-border bg-muted/30 flex border-b">
      <div className="border-border w-[17.55%] border-r p-3 font-medium">
        Competency
      </div>
      <div className="flex flex-1">
        {levels.map((level, index) => {
          // Split level name if it contains parentheses
          const parts = level.split(/(\([^)]+\))/);

          return (
            <div
              key={index}
              className="border-border flex-1 border-r p-3 text-center text-sm font-medium last:border-r-0"
            >
              {parts.length > 1 ? (
                <>
                  <span className="whitespace-nowrap">{parts[0].trim()}</span>
                  <br />
                  <span className="whitespace-nowrap">{parts[1]}</span>
                </>
              ) : (
                <span className="whitespace-nowrap">{level}</span>
              )}
            </div>
          );
        })}
      </div>
      {showBothRatings && (
        <div className="border-border w-48 border-l p-3 text-center text-sm font-medium">
          Assessment
        </div>
      )}
    </div>
  );
};

export default CompetencyMatrixHeader;
