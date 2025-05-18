"use client";

import React from "react";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import type { UserWithArchetype } from "~/server/queries/user";
import type { OrgUnit } from "~/server/queries/org-unit";
import type { UserArchetype } from "~/server/queries/user-archetype";
import type { CompMatrixCurrentRating } from "~/server/queries/comp-matrix-current-rating";

type Props = {
  selectedMatrix: CompMatrixWithFullRelations;
  filteredEmployees: UserWithArchetype[];
  compMatrixCurrentRatings: CompMatrixCurrentRating[] | undefined;
  selectedOrgUnit: number | null;
  selectedArchetype: number | null;
  orgUnits: OrgUnit[];
  archetypes: UserArchetype[];
};

export function RatingDistributionReport({
  selectedMatrix,
  filteredEmployees,
  compMatrixCurrentRatings,
}: Props) {
  const definitionIds = selectedMatrix.areas
    .flatMap((area) =>
      area.competencies.flatMap((comp) =>
        comp.definitions.map((def) => def.id),
      ),
    )
    .filter(Boolean);

  const distributionMap: Record<number, Record<number, number>> = {};
  if (Array.isArray(compMatrixCurrentRatings)) {
    for (const rating of compMatrixCurrentRatings) {
      const defId = rating.compMatrixDefinitionId;
      const ratingId = rating.managerRatingId;
      if (defId == null || ratingId == null) continue;
      if (!distributionMap[defId]) {
        distributionMap[defId] = {};
      }
      distributionMap[defId][ratingId] =
        (distributionMap[defId][ratingId] ?? 0) + 1;
    }
  }

  const getDistributionBar = (definitionId: number) => {
    const ratings = distributionMap[definitionId];
    if (!ratings) return null;

    const total = Object.values(ratings).reduce((acc, count) => acc + count, 0);
    if (total === 0) return null;

    return (
      <div className="flex h-5 w-full overflow-hidden rounded border border-gray-200">
        {selectedMatrix.ratingOptions.map((opt) => {
          const count = ratings[opt.id] ?? 0;
          const percentage = (count / total) * 100;
          if (count === 0) return null;
          return (
            <div
              key={opt.id}
              style={{
                width: `${percentage}%`,
                backgroundColor: opt.color,
              }}
              className="h-full"
              title={`${opt.title}: ${count}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Rating Distribution ({filteredEmployees.length} people)
      </h2>
      <div className="overflow-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 text-left font-medium">
                Competency
              </th>
              {selectedMatrix.levels.map((level) => (
                <th
                  key={level.id}
                  className="border border-gray-300 bg-gray-100 p-2 text-left font-medium"
                >
                  {level.levelCode}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedMatrix.areas.map((area) => (
              <React.Fragment key={area.id}>
                <tr>
                  <td
                    colSpan={1 + selectedMatrix.levels.length}
                    className="bg-muted border-t border-b border-gray-400 px-2 py-1 font-semibold text-gray-700"
                  >
                    {area.title}
                  </td>
                </tr>
                {area.competencies.map((comp) => (
                  <tr key={comp.id}>
                    <td className="border border-gray-300 px-2 py-1 font-medium text-gray-800">
                      {comp.title}
                    </td>
                    {selectedMatrix.levels.map((level) => {
                      const def = comp.definitions.find(
                        (d) => d.compMatrixLevelId === level.id,
                      );
                      return (
                        <td
                          key={level.id}
                          className="border border-gray-300 p-1"
                        >
                          {def ? getDistributionBar(def.id) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
