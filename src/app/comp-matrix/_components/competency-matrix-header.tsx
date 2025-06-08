"use client";

import React from "react";
import type { CompMatrixLevel } from "~/server/queries/comp-matrix-level";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import { formatLevelCode } from "~/lib/format-utils";
interface CompetencyMatrixHeaderProps {
  levels: CompMatrixLevel[];
  compMatrix?: CompMatrixWithFullRelations;
}

const CompetencyMatrixHeader: React.FC<CompetencyMatrixHeaderProps> = ({
  levels,
  compMatrix,
}) => {
  return (
    <div className="border-border bg-muted/30 flex border-b">
      <div className="border-border w-[17.55%] border-r p-3 font-medium">
        Competency
      </div>
      <div className="flex flex-1">
        {levels?.map((level, index) => {
          return (
            <div
              key={index}
              className="border-border flex-1 border-r p-3 text-center text-sm font-medium last:border-r-0"
            >
              <span className="whitespace-nowrap">{level.jobTitle}</span>
              <br />
              <span className="whitespace-nowrap">({compMatrix ? formatLevelCode(compMatrix.levelCode, level.numericLevel) : level.levelCode})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompetencyMatrixHeader;
