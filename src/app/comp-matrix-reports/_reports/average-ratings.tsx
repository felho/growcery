"use client";

import React from "react";
import type { CompMatrixWithFullRelations } from "~/server/queries/comp-matrix";
import type { UserWithArchetype } from "~/server/queries/user";
import type { OrgUnit } from "~/server/queries/org-unit";
import type { CompMatrixCurrentRating } from "~/server/queries/comp-matrix-current-rating";

type Props = {
  selectedMatrix: CompMatrixWithFullRelations;
  filteredEmployees: UserWithArchetype[];
  compMatrixCurrentRatings: CompMatrixCurrentRating[] | undefined;
  selectedOrgUnit: number | null;
  selectedArchetype: number | null;
  orgUnits: OrgUnit[];
  archetypes: { id: number; name: string }[];
};

export const AverageRatingsReport = ({
  selectedMatrix,
  filteredEmployees,
  compMatrixCurrentRatings,
  selectedOrgUnit,
  selectedArchetype,
  orgUnits,
  archetypes,
}: Props) => {
  const averageRatings: Record<number, { sum: number; count: number }> = {};

  if (Array.isArray(compMatrixCurrentRatings)) {
    for (const record of compMatrixCurrentRatings) {
      const defId = record.compMatrixDefinitionId;
      const ratingId = record.managerRatingId;
      if (ratingId == null) continue;

      const ratingOption = selectedMatrix.ratingOptions.find(
        (opt) => opt.id === ratingId,
      );
      if (!ratingOption) continue;

      const weight = ratingOption.calculationWeight;
      if (!averageRatings[defId]) {
        averageRatings[defId] = { sum: 0, count: 0 };
      }
      averageRatings[defId].sum += weight;
      averageRatings[defId].count += 1;
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Average Ratings ({filteredEmployees.length} people
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
                            className="text-muted-foreground border px-4 py-2 text-center font-medium"
                          >
                            N/A
                          </td>
                        );
                      }

                      const data = averageRatings[def.id];
                      const maxWeight =
                        selectedMatrix?.ratingOptions?.reduce(
                          (acc, opt) => Math.max(acc, opt.calculationWeight),
                          0,
                        ) ?? 0;
                      const percent =
                        data && data.count > 0 && maxWeight > 0
                          ? Math.round(
                              (data.sum / (data.count * maxWeight)) * 100,
                            )
                          : null;
                      const backgroundColor =
                        percent === null
                          ? "#f3f4f6"
                          : `rgba(59, 130, 246, ${percent / 100})`;

                      return (
                        <td
                          key={level.id}
                          className="min-w-25 border px-4 py-2 text-center font-medium"
                          style={{ backgroundColor }}
                        >
                          {percent !== null ? `${percent}%` : "—"}
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
};
