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
  selectedOrgUnit,
  selectedArchetype,
  orgUnits,
  archetypes,
}: Props) {
  const distributionMap: Record<number, Record<number, number>> = {};

  if (Array.isArray(compMatrixCurrentRatings)) {
    for (const record of compMatrixCurrentRatings) {
      const defId = record.compMatrixDefinitionId;
      const ratingId = record.managerRatingId;
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
    if (!ratings) return "—";

    const total = Object.values(ratings).reduce((acc, count) => acc + count, 0);
    if (total === 0) return "—";

    const sortedOptions = [...selectedMatrix.ratingOptions].sort(
      (a, b) => a.calculationWeight - b.calculationWeight,
    );

    return (
      <div className="flex h-5 w-full overflow-hidden">
        {sortedOptions.map((opt) => {
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
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Rating Distribution ({filteredEmployees.length} people
        {selectedOrgUnit !== null &&
          ` in ${orgUnits.find((ou) => ou.id === selectedOrgUnit)?.name}`}
        {selectedArchetype !== null &&
          `, archetype: ${
            archetypes.find((a) => a.id === selectedArchetype)?.name
          }`}
        )
      </h2>
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Competency</th>
              {selectedMatrix.levels.map((level) => (
                <th key={level.id} className="border px-4 py-2 text-center">
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
                    className="bg-muted px-4 py-2 text-left font-semibold"
                  >
                    {area.title}
                  </td>
                </tr>
                {area.competencies.map((competency) => (
                  <tr key={competency.id}>
                    <td className="border px-4 py-2">{competency.title}</td>
                    {selectedMatrix.levels.map((level) => {
                      const def = competency.definitions.find(
                        (d) => d.compMatrixLevelId === level.id,
                      );
                      if (!def) {
                        return (
                          <td key={level.id} className="border px-4 py-2">
                            —
                          </td>
                        );
                      }

                      if (def.inheritsPreviousLevel) {
                        return (
                          <td
                            key={level.id}
                            className="border bg-gray-200 px-4 py-2 text-center font-medium text-gray-500"
                          >
                            N/A
                          </td>
                        );
                      }

                      return (
                        <td
                          key={level.id}
                          className="min-w-25 border px-4 py-2 text-center font-medium"
                        >
                          {getDistributionBar(def.id)}
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
