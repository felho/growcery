import { NextRequest } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import * as XLSX from "xlsx";
import {
  getBaseEntities,
  getDefinitionMap,
  getRatingOptionMap,
  insertCurrentRatings,
  upsertLevelAssessments,
} from "~/server/db/data/comp-matrix-import-helpers";

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    // Get form data
    const employeeName = formData.get("employeeName") as string;
    const employeeEmail = formData.get("employeeEmail") as string;
    const managerId = formData.get("managerId") as string;
    const functionId = formData.get("functionId") as string;
    const orgUnitId = formData.get("orgUnitId") as string;
    const archetypeId = formData.get("archetypeId") as string;
    const matrixId = formData.get("matrixId") as string;

    // Validate required fields
    if (
      !employeeName ||
      !employeeEmail ||
      !managerId ||
      !functionId ||
      !orgUnitId ||
      !archetypeId ||
      !matrixId
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Create temp directory if it doesn't exist
    const tempDir = join(tmpdir(), "comp-matrix-import");
    await mkdir(tempDir, { recursive: true });

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFileName = `${Date.now()}-${file.name}`;
    tempFilePath = join(tempDir, uniqueFileName);

    console.log("Saving file to:", tempFilePath);
    await writeFile(tempFilePath, buffer);
    console.log("File saved successfully");

    // Process the file
    const messages: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      messages.push(args.join(" "));
      originalConsoleLog(...args);
    };

    try {
      // Get base entities
      const { orgUnit, func, archetype, employee, manager, assignment } =
        await getBaseEntities({
          employeeName,
          employeeEmail,
          managerId: parseInt(managerId!),
          functionId: parseInt(functionId!),
          orgUnitId: parseInt(orgUnitId!),
          archetypeId: parseInt(archetypeId!),
          matrixId: parseInt(matrixId!),
        });

      // Get definition and rating option maps
      const definitionMap = await getDefinitionMap();
      const ratingOptionMap = await getRatingOptionMap(parseInt(matrixId!));

      // Read Excel file directly from buffer
      console.log("Reading Excel file from buffer");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      console.log("Excel file read successfully");

      const teamSheet = workbook.Sheets["Team member assessment"];
      const managerSheet = workbook.Sheets["Manager assessment"];
      const heatmapSheet = workbook.Sheets["Heatmap"];

      if (!teamSheet || !managerSheet) {
        throw new Error("Missing required sheets in the Excel file");
      }

      // --- HEATMAP LEVEL ASSESSMENTS ---
      let savedLevelAssessments: any[] = [];
      if (heatmapSheet) {
        console.log("[DEBUG] Heatmap sheet found");
        // Helper to parse "4,3" or "4.3" to {mainLevel, subLevel}
        function parseLevelValue(val: any) {
          if (typeof val === "number") {
            // Pl. 4.3 -> mainLevel: 4, subLevel: 3
            const mainLevel = Math.floor(val);
            const subLevel = Math.round((val - mainLevel) * 10);
            return { mainLevel, subLevel };
          }
          if (typeof val === "string") {
            // Pl. "4,3" vagy "4.3"
            let match = val.trim().match(/^(\d+)[,.](\d+)$/);
            if (match) {
              return {
                mainLevel: parseInt(match[1]!),
                subLevel: parseInt(match[2]!),
              };
            }
            // Pl. "E4.2" vagy "E4,2"
            match = val.trim().match(/^E(\d+)[,.](\d+)$/i);
            if (match) {
              return {
                mainLevel: parseInt(match[1]!),
                subLevel: parseInt(match[2]!),
              };
            }
          }
          return null;
        }
        // Area cell mapping
        const areaCells = [
          { area: "Craftsmanship", cell: "J2" },
          { area: "Collaboration", cell: "J7" },
          { area: "Leadership", cell: "J11" },
          { area: "Impact", cell: "J14" },
        ];
        const generalCell = "L2";
        const assessments = [];
        for (const { area, cell } of areaCells) {
          const val = heatmapSheet[cell]?.v;
          console.log(`[DEBUG] Heatmap cell ${cell} (${area}):`, val);
          const parsed = parseLevelValue(val);
          if (parsed) {
            assessments.push({
              isGeneral: false,
              areaTitle: area,
              mainLevel: parsed.mainLevel,
              subLevel: parsed.subLevel,
            });
            savedLevelAssessments.push({
              type: area,
              mainLevel: parsed.mainLevel,
              subLevel: parsed.subLevel,
            });
          }
        }
        // General
        const generalVal = heatmapSheet[generalCell]?.v;
        console.log(
          `[DEBUG] Heatmap cell ${generalCell} (General):`,
          generalVal,
        );
        const parsedGeneral = parseLevelValue(generalVal);
        if (parsedGeneral) {
          assessments.push({
            isGeneral: true,
            areaTitle: null,
            mainLevel: parsedGeneral.mainLevel,
            subLevel: parsedGeneral.subLevel,
          });
          savedLevelAssessments.push({
            type: "General",
            mainLevel: parsedGeneral.mainLevel,
            subLevel: parsedGeneral.subLevel,
          });
        }
        console.log("[DEBUG] Assessments to save:", assessments);
        // Always call upsertLevelAssessments even if there are no assessments
        // This ensures existing assessments are deleted if they're not in the import
        console.log("[DEBUG] Calling upsertLevelAssessments with:", {
          assignmentId: assignment.id,
          matrixId: parseInt(matrixId!),
          assessments,
        });
        await upsertLevelAssessments({
          assignmentId: assignment.id,
          matrixId: parseInt(matrixId!),
          assessments,
        });
        console.log("[DEBUG] upsertLevelAssessments finished");
      }
      // --- END HEATMAP ---

      // Extract ratings
      const ratings = extractRatingsFromSheets(
        teamSheet,
        managerSheet,
        definitionMap,
        ratingOptionMap,
      );

      // Insert ratings
      await insertCurrentRatings({
        assignmentId: assignment.id,
        matrixId: parseInt(matrixId!),
        managerId: manager.id,
        ratings,
      });

      // Restore console.log
      console.log = originalConsoleLog;

      // Clean up
      if (tempFilePath) {
        try {
          await unlink(tempFilePath);
        } catch (error) {
          console.error("Error deleting temporary file:", error);
        }
      }

      return new Response(JSON.stringify({ messages, savedLevelAssessments }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      // Restore console.log
      console.log = originalConsoleLog;

      // Clean up
      if (tempFilePath) {
        try {
          await unlink(tempFilePath);
        } catch (error) {
          console.error("Error deleting temporary file:", error);
        }
      }

      throw error;
    }
  } catch (error: unknown) {
    console.error("Error processing file:", error);
    return new Response(
      JSON.stringify({
        error: "Error processing file",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

function extractRatingsFromSheets(
  teamSheet: XLSX.WorkSheet,
  managerSheet: XLSX.WorkSheet,
  definitionMap: Map<string, number>,
  ratingOptionMap: Map<string, number>,
): Array<{
  definitionId: number;
  selfRatingId?: number;
  selfComment?: string;
  managerRatingId?: number;
  managerComment?: string;
}> {
  const teamData: any[][] = XLSX.utils.sheet_to_json(teamSheet, { header: 1 });
  const managerData: any[][] = XLSX.utils.sheet_to_json(managerSheet, {
    header: 1,
  });

  // Extract level codes from B1, D1, F1...
  const levelCodes: string[] = [];
  const levelPositions: number[] = [];
  for (let col = 1; col <= 11; col += 2) {
    const cell = teamData[0]?.[col];
    if (typeof cell === "string") {
      const match = cell.match(/\(([^)]+)\)/); // e.g. "(E1)"
      if (match && match[1]) {
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
        if (!col) continue; // Skip if col is undefined

        const key = `${title}::${levelCode}`;
        const definitionId = definitionMap.get(key);
        console.log(`🔍 Processing: ${key} → ${definitionId}`);
        if (!definitionId) {
          console.log("⚠️ Missing definitionId for key:", key);
          console.log(
            "  Available keys in definitionMap:",
            Array.from(definitionMap.keys()),
          );
          continue;
        }

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
        console.log("📥 Extracted entry", JSON.stringify(obj, null, 2));
        results.push(obj);
      }
    }
  }

  return results;
}
