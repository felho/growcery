"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { LevelAssessment } from "~/zod-schemas/comp-matrix-level-assessments";

interface Props {
  data: LevelAssessment[];
}

interface HistogramRow {
  mainLevel: number;
  general: number[];
  craft: number[];
  collab: number[];
  leadership: number[];
  impact: number[];
}

const areaKeys = [
  "general",
  "craft",
  "collab",
  "leadership",
  "impact",
] as const;
const subColors = ["#dbeafe", "#60a5fa", "#1d4ed8"]; // sublevel 1 = light, 2 = mid, 3 = dark

export function LevelHistogram({ data }: Props) {
  const histogramData = useMemo(() => {
    const initialAreaCounts = (): number[] => [0, 0, 0];
    const result: Record<number, HistogramRow> = {};

    for (const assessment of data) {
      const { mainLevel, subLevel, isGeneral, compMatrixAreaId } = assessment;
      const area = isGeneral
        ? "general"
        : compMatrixAreaId === 1
          ? "craft"
          : compMatrixAreaId === 2
            ? "collab"
            : compMatrixAreaId === 3
              ? "leadership"
              : compMatrixAreaId === 4
                ? "impact"
                : null;

      if (!area || subLevel < 1 || subLevel > 3) continue;

      if (!result[mainLevel]) {
        result[mainLevel] = {
          mainLevel,
          general: initialAreaCounts(),
          craft: initialAreaCounts(),
          collab: initialAreaCounts(),
          leadership: initialAreaCounts(),
          impact: initialAreaCounts(),
        };
      }

      const levelData = result[mainLevel];
      if (levelData && area in levelData) {
        if (Array.isArray(levelData[area])) {
          levelData[area][subLevel - 1] =
            (levelData[area][subLevel - 1] ?? 0) + 1;
        }
      }
    }

    return Object.values(result).sort((a, b) => a.mainLevel - b.mainLevel);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mainLevel" />
            <YAxis />
            {areaKeys.map((areaKey) =>
              [0, 1, 2].map((subIndex) => (
                <Bar
                  key={`${areaKey}-sub${subIndex + 1}`}
                  dataKey={(entry: HistogramRow) => entry[areaKey][subIndex]}
                  stackId={`${areaKey}-stack`}
                  fill={subColors[subIndex]}
                  name={`${areaKey.toUpperCase().slice(0, 3)}.${subIndex + 1}`}
                />
              )),
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
