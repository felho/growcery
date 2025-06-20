import {
  createFunction,
  getFunctionById,
  getFunctionsByOrg,
} from "../../queries/function";
import {
  createUserArchetype,
  getAllUserArchetypesForOrg,
  getUserArchetypeById,
} from "../../queries/user-archetype";
import {
  createUser,
  getAllUsersForOrg,
  getUserById,
  updateUser,
} from "../../queries/user";
import {
  createUserCompMatrixAssignment,
  getActiveUserCompMatrixAssignmentByUserId,
} from "../../queries/user_comp_matrix_assignment";
import { getAllOrgUnitsForOrg } from "../../queries/org-unit";
import type { OptionValues } from "commander";

const organizationId = 1;

async function getOrCreateFunction(name: string) {
  const functions = await getFunctionsByOrg(organizationId);
  let func = functions.find((f) => f.name === name);
  if (!func) {
    const funcId = await createFunction({
      name,
      organizationId,
      description: "",
    });
    func = await getFunctionById(funcId);
  }
  return func;
}

async function getOrCreateArchetype(name: string) {
  const archetypes = await getAllUserArchetypesForOrg(organizationId);
  let archetype = archetypes.find((a) => a.name === name);
  if (!archetype) {
    const archetypeId = await createUserArchetype({
      name,
      organizationId,
      description: "",
    });
    archetype = await getUserArchetypeById(archetypeId);
  }
  return archetype;
}

async function getOrCreateUser(
  name: string,
  email: string,
  orgUnitId: number | null,
  functionId: number | null,
  archetypeId: number | null,
  managerId: number | null,
) {
  const users = await getAllUsersForOrg(organizationId);
  let user = users.find((u) => u.fullName === name);

  if (!user) {
    const userId = await createUser({
      fullName: name,
      email,
      organizationId,
      isManager: false,
      orgUnitId: orgUnitId ?? undefined,
      functionId: functionId ?? undefined,
      archetypeId: archetypeId ?? undefined,
      managerId: managerId ?? undefined,
    });
    user = await getUserById(userId);
  } else {
    // Update existing user's metadata if needed
    const needsUpdate =
      (orgUnitId && user.orgUnitId !== orgUnitId) ||
      (functionId && user.functionId !== functionId) ||
      (archetypeId && user.archetypeId !== archetypeId) ||
      (managerId && user.managerId !== managerId);

    if (needsUpdate) {
      await updateUser({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isManager: false,
        orgUnitId: orgUnitId ?? undefined,
        functionId: functionId ?? undefined,
        archetypeId: archetypeId ?? undefined,
        managerId: managerId ?? undefined,
      });
      user = await getUserById(user.id);
    }
  }
  return user;
}

async function getOrCreateUserCompMatrixAssignment(
  userId: number,
  matrixId: number,
  createdBy: number,
) {
  let assignment = await getActiveUserCompMatrixAssignmentByUserId(userId);
  if (!assignment) {
    assignment = await createUserCompMatrixAssignment({
      revieweeId: userId,
      compMatrixId: matrixId,
      createdBy,
      isActive: true,
    });
  }
  return assignment;
}

async function getOrgUnitById(id: number) {
  const orgUnits = await getAllOrgUnitsForOrg(organizationId);
  const orgUnit = orgUnits.find((o) => o.id === id);
  if (!orgUnit) {
    throw new Error(`Org unit not found with ID: ${id}`);
  }
  return orgUnit;
}

export async function getBaseEntities(options: {
  employeeName: string;
  employeeEmail: string;
  managerId: number;
  functionId: number;
  orgUnitId: number | null;
  archetypeId: number | null;
  matrixId: number;
}) {
  // Get function (required)
  const func = await getFunctionById(options.functionId);
  if (!func) {
    throw new Error(`Function not found with ID: ${options.functionId}`);
  }
  
  // Get org unit (optional)
  let orgUnit = null;
  if (options.orgUnitId !== null) {
    orgUnit = await getOrgUnitById(options.orgUnitId);
    if (!orgUnit) {
      throw new Error(`Org unit not found with ID: ${options.orgUnitId}`);
    }
  }
  
  // Get archetype (optional)
  let archetype = null;
  if (options.archetypeId !== null) {
    archetype = await getUserArchetypeById(options.archetypeId);
    if (!archetype) {
      throw new Error(`Archetype not found with ID: ${options.archetypeId}`);
    }
  }
  const manager = await getUserById(options.managerId);
  if (!manager) {
    throw new Error(`Manager not found with ID: ${options.managerId}`);
  }
  const employee = await getOrCreateUser(
    options.employeeName,
    options.employeeEmail,
    orgUnit?.id || null,
    func.id,
    archetype?.id || null,
    manager.id,
  );
  if (!employee) {
    throw new Error(`Employee not found: ${options.employeeName}`);
  }

  const assignment = await getOrCreateUserCompMatrixAssignment(
    employee.id,
    options.matrixId,
    manager.id,
  );
  if (!assignment) {
    throw new Error(`Assignment not found: ${options.employeeName}`);
  }

  return { orgUnit, func, archetype, employee, manager, assignment };
}

import { db } from "~/server/db";
import {
  compMatrixDefinitions,
  compMatrixCompetencies,
  compMatrixLevels,
  compMatrices,
} from "~/server/db/schema";
import { formatLevelCode } from "~/lib/format-utils";
import { and, eq } from "drizzle-orm";

export async function getDefinitionMap(
  matrixId: number,
): Promise<Map<string, number>> {
  // Először lekérdezzük a mátrix levelCode mezőjét
  const matrixResult = await db
    .select({ levelCode: compMatrices.levelCode })
    .from(compMatrices)
    .where(eq(compMatrices.id, matrixId))
    .limit(1);
  
  if (!matrixResult[0]) {
    throw new Error(`Matrix not found with ID: ${matrixId}`);
  }
  
  const matrixLevelCode = matrixResult[0].levelCode;
  
  // Lekérdezzük a definíciókat a szint numericLevel mezőjével együtt
  const rows = await db
    .select({
      id: compMatrixDefinitions.id,
      compTitle: compMatrixCompetencies.title,
      numericLevel: compMatrixLevels.numericLevel,
    })
    .from(compMatrixDefinitions)
    .innerJoin(
      compMatrixCompetencies,
      eq(
        compMatrixDefinitions.compMatrixCompetencyId,
        compMatrixCompetencies.id,
      ),
    )
    .innerJoin(
      compMatrixLevels,
      eq(compMatrixDefinitions.compMatrixLevelId, compMatrixLevels.id),
    )
    .where(eq(compMatrixLevels.compMatrixId, matrixId));

  const map = new Map<string, number>();
  for (const row of rows) {
    // Generáljuk a kombinált levelCode-ot
    const combinedLevelCode = formatLevelCode(matrixLevelCode, row.numericLevel);
    
    // Map L1 to E1, etc. (speciális importálási logika)
    const levelCode = combinedLevelCode.replace(matrixLevelCode, "E");
    
    map.set(`${row.compTitle}::${levelCode}`, row.id);
  }

  return map;
}

import { compMatrixRatingOptions } from "~/server/db/schema";

export async function getRatingOptionMap(
  matrixId: number,
): Promise<Map<string, number>> {
  const rows = await db
    .select({
      id: compMatrixRatingOptions.id,
      label: compMatrixRatingOptions.title,
    })
    .from(compMatrixRatingOptions)
    .where(eq(compMatrixRatingOptions.competencyMatrixId, matrixId));

  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.label.trim(), row.id);
  }

  return map;
}

import { compMatrixCurrentRatings } from "~/server/db/schema";

type CompMatrixCombinedRatingInput = {
  definitionId: number;
  selfRatingId?: number;
  selfComment?: string;
  managerRatingId?: number;
  managerComment?: string;
};
type InsertCurrentRatingsParams = {
  assignmentId: number;
  matrixId: number;
  managerId: number;
  ratings: CompMatrixCombinedRatingInput[];
};

export async function insertCurrentRatings({
  assignmentId,
  matrixId,
  managerId,
  ratings,
}: InsertCurrentRatingsParams) {
  for (const rating of ratings) {
    if (
      rating.selfRatingId === undefined &&
      !rating.selfComment &&
      rating.managerRatingId === undefined &&
      !rating.managerComment
    ) {
      continue;
    }

    // Truncate comments to 1000 characters if they're longer
    const selfComment =
      rating.selfComment && rating.selfComment.length > 1000
        ? rating.selfComment.substring(0, 1000)
        : rating.selfComment;

    const managerComment =
      rating.managerComment && rating.managerComment.length > 1000
        ? rating.managerComment.substring(0, 1000)
        : rating.managerComment;

    await db
      .insert(compMatrixCurrentRatings)
      .values({
        compMatrixId: matrixId,
        userCompMatrixAssignmentId: assignmentId,
        compMatrixDefinitionId: rating.definitionId,
        selfRatingId: rating.selfRatingId,
        selfComment,
        managerId,
        managerRatingId: rating.managerRatingId,
        managerComment,
      })
      .onConflictDoUpdate({
        target: [
          compMatrixCurrentRatings.userCompMatrixAssignmentId,
          compMatrixCurrentRatings.compMatrixDefinitionId,
        ],
        set: {
          selfRatingId: rating.selfRatingId,
          selfComment: selfComment,
          managerId,
          managerRatingId: rating.managerRatingId,
          managerComment: managerComment,
        },
      });
  }
}

import {
  compMatrixLevelAssessments,
  compMatrixAreas,
} from "~/server/db/schema";
import { sql } from "drizzle-orm";

/**
 * Upsert level assessments for a user assignment and matrix.
 * @param params
 *   - assignmentId: userCompMatrixAssignmentId
 *   - matrixId: compMatrixId
 *   - assessments: Array<{ isGeneral, areaTitle, mainLevel, subLevel }>
 *     - isGeneral: true, areaTitle: null (general), false + areaTitle (area)
 */
export async function upsertLevelAssessments({
  assignmentId,
  matrixId,
  assessments,
}: {
  assignmentId: number;
  matrixId: number;
  assessments: Array<{
    isGeneral: boolean;
    areaTitle: string | null;
    mainLevel: number;
    subLevel: number;
  }>;
}) {
  // Get all areas for this matrix
  const areaRows = await db
    .select({ id: compMatrixAreas.id, title: compMatrixAreas.title })
    .from(compMatrixAreas)
    .where(eq(compMatrixAreas.compMatrixId, matrixId));
  const areaMap = new Map(areaRows.map((a) => [a.title, a.id]));

  // First, let's find all existing assessments for this assignment
  const existingAssessments = await db
    .select()
    .from(compMatrixLevelAssessments)
    .where(
      eq(compMatrixLevelAssessments.userCompMatrixAssignmentId, assignmentId),
    );

  // Create a map for quick lookup
  const existingAssessmentsMap = new Map();
  for (const existing of existingAssessments) {
    if (existing.isGeneral) {
      existingAssessmentsMap.set("general", existing);
    } else if (existing.compMatrixAreaId) {
      existingAssessmentsMap.set(`area-${existing.compMatrixAreaId}`, existing);
    }
  }

  // Keep track of which assessments are processed
  const processedKeys = new Set<string>();

  // Process each assessment
  for (const assessment of assessments) {
    let compMatrixAreaId: number | null = null;
    if (!assessment.isGeneral && assessment.areaTitle) {
      compMatrixAreaId = areaMap.get(assessment.areaTitle) ?? null;
      if (!compMatrixAreaId) {
        throw new Error(`Area not found: ${assessment.areaTitle}`);
      }
    }

    // Check if an assessment already exists
    const key = assessment.isGeneral ? "general" : `area-${compMatrixAreaId}`;
    processedKeys.add(key); // Mark this key as processed

    const existingAssessment = existingAssessmentsMap.get(key);

    if (existingAssessment) {
      // Update existing assessment
      await db
        .update(compMatrixLevelAssessments)
        .set({
          mainLevel: assessment.mainLevel,
          subLevel: assessment.subLevel,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(compMatrixLevelAssessments.id, existingAssessment.id));
    } else {
      // Insert new assessment
      await db.insert(compMatrixLevelAssessments).values({
        userCompMatrixAssignmentId: assignmentId,
        compMatrixId: matrixId,
        isGeneral: assessment.isGeneral,
        compMatrixAreaId,
        mainLevel: assessment.mainLevel,
        subLevel: assessment.subLevel,
      });
    }
  }

  // Delete existing assessments that weren't in the imported file
  for (const [key, assessment] of existingAssessmentsMap.entries()) {
    if (!processedKeys.has(key)) {
      // This assessment wasn't in the imported file, so delete it
      await db
        .delete(compMatrixLevelAssessments)
        .where(eq(compMatrixLevelAssessments.id, assessment.id));

      console.log(
        `Deleted assessment with id ${assessment.id} that wasn't in the import`,
      );
    }
  }
}
