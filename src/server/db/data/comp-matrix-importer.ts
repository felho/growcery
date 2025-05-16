import "dotenv/config";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { Command } from "commander";
import xlsx from "xlsx";
import {
  getBaseEntities,
  getDefinitionMap,
  getRatingOptionMap,
  insertCurrentRatings,
} from "./comp-matrix-import-helpers";

const program = new Command();

program
  .requiredOption("-f, --file <path>", "Path to the Excel file")
  .requiredOption("--matrixId <id>", "Matrix ID", parseInt)
  .requiredOption("--employeeName <name>")
  .requiredOption("--employeeEmail <email>")
  .requiredOption("--managerName <name>")
  .requiredOption("--managerEmail <email>")
  .requiredOption("--orgUnit <name>")
  .requiredOption("--function <name>")
  .requiredOption("--archetype <name>")
  .parse(process.argv);

const organizationId = 1;

(async () => {
  const options = program.opts();

  const matrixId = options.matrixId;
  const { orgUnit, func, archetype, employee, manager, assignment } =
    await getBaseEntities(options);

  const definitionMap = await getDefinitionMap();

  const ratingOptionMap = await getRatingOptionMap(matrixId);

  const workbook = xlsx.readFile(resolve(options.file));
  const teamSheet = workbook.Sheets["Team member assessment"];
  const managerSheet = workbook.Sheets["Manager assessment"];
  if (!teamSheet || !managerSheet) {
    throw new Error("Missing required sheets in the Excel file");
  }

  const ratings = extractRatingsFromSheets(
    teamSheet,
    managerSheet,
    definitionMap,
    ratingOptionMap,
  );
  console.log(ratings);

  await insertCurrentRatings({
    assignmentId: assignment.id,
    matrixId,
    managerId: manager.id,
    ratings,
  });

  console.log("✅ Import successful");
})();

function extractRatingsFromSheets(
  teamSheet: xlsx.WorkSheet,
  managerSheet: xlsx.WorkSheet,
  definitionMap: Map<string, number>,
  ratingOptionMap: Map<string, number>,
): Array<{
  definitionId: number;
  selfRatingId?: number;
  selfComment?: string;
  managerRatingId?: number;
  managerComment?: string;
}> {
  const teamData: any[][] = xlsx.utils.sheet_to_json(teamSheet, { header: 1 });
  const managerData: any[][] = xlsx.utils.sheet_to_json(managerSheet, {
    header: 1,
  });

  // 1. Szint kódok kiszedése B1, D1, F1...
  const levelCodes: string[] = [];
  const levelPositions: number[] = [];
  for (let col = 1; col <= 11; col += 2) {
    const cell = teamData[0]?.[col];
    if (typeof cell === "string") {
      const match = cell.match(/\(([^)]+)\)/); // pl. "(E1)"
      if (match) {
        levelCodes.push(match[1]);
        levelPositions.push(col);
      }
    }
  }

  const blocks = [
    { start: 7, count: 5 },
    { start: 28, count: 4 },
    { start: 45, count: 3 },
    { start: 58, count: 3 },
  ];

  const results: Array<any> = [];

  for (const block of blocks) {
    for (let i = 0; i < block.count; ++i) {
      const base = block.start + i * 4;
      const title = teamData[base]?.[1]?.trim();
      if (!title) continue;

      for (let i = 0; i < levelCodes.length; ++i) {
        const levelCode = levelCodes[i];
        const col = levelPositions[i];
        const key = `${title}::${levelCode}`;
        const definitionId = definitionMap.get(key);
        if (!definitionId) continue;

        const obj: any = { definitionId };

        // Self rating
        const selfRating = teamData[base + 3]?.[col];
        const selfComment = teamData[base + 3]?.[col + 1];
        if (typeof selfRating === "string") {
          const ratingId = ratingOptionMap.get(selfRating.trim());
          if (ratingId) {
            obj.selfRatingId = ratingId;
          }
        }
        if (
          typeof selfComment === "string" &&
          !ratingOptionMap.has(selfComment.trim())
        ) {
          obj.selfComment = selfComment.trim();
        }

        // Manager rating
        const mgrRating = managerData[base + 3]?.[col];
        const mgrComment = managerData[base + 3]?.[col + 1];
        if (typeof mgrRating === "string") {
          const ratingId = ratingOptionMap.get(mgrRating.trim());
          if (ratingId) {
            obj.managerRatingId = ratingId;
          }
        }
        if (
          typeof mgrComment === "string" &&
          !ratingOptionMap.has(mgrComment.trim())
        ) {
          obj.managerComment = mgrComment.trim();
        }

        obj.levelCode = levelCode;
        obj.competency = title;
        obj.rawSelfRatingText = selfRating;
        obj.rawManagerRatingText = mgrRating;
        results.push(obj);
      }
    }
  }

  return results;
}
