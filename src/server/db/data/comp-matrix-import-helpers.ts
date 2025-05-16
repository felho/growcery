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
import { createUser, getAllUsersForOrg, getUserById } from "../../queries/user";
import {
  createUserCompMatrixAssignment,
  getUserCompMatrixAssignmentByUserId,
} from "../../queries/user_comp_matrix_assignments";
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
      orgUnitId: orgUnitId ?? undefined,
      functionId: functionId ?? undefined,
      archetypeId: archetypeId ?? undefined,
      managerId: managerId ?? undefined,
    });
    user = await getUserById(userId);
  }
  return user;
}

async function getOrCreateUserCompMatrixAssignment(
  userId: number,
  matrixId: number,
  createdBy: number,
) {
  let assignment = await getUserCompMatrixAssignmentByUserId(userId);
  if (!assignment) {
    assignment = await createUserCompMatrixAssignment({
      revieweeId: userId,
      compMatrixId: matrixId,
      createdBy,
    });
  }
  return assignment;
}

async function getOrgUnitOrThrow(name: string) {
  const orgUnits = await getAllOrgUnitsForOrg(organizationId);
  const orgUnit = orgUnits.find((o) => o.name === name);
  if (!orgUnit) {
    throw new Error(`Org unit not found: ${name}`);
  }
  return orgUnit;
}

export async function getBaseEntities(options: OptionValues) {
  const orgUnit = await getOrgUnitOrThrow(options.orgUnit);
  const func = await getOrCreateFunction(options.function);
  if (!func) {
    throw new Error(`Function not found: ${options.function}`);
  }
  const archetype = await getOrCreateArchetype(options.archetype);
  if (!archetype) {
    throw new Error(`Archetype not found: ${options.archetype}`);
  }
  const manager = await getOrCreateUser(
    options.managerName,
    options.managerEmail,
    null,
    null,
    null,
    null,
  );
  if (!manager) {
    throw new Error(`Manager not found: ${options.managerName}`);
  }
  const employee = await getOrCreateUser(
    options.employeeName,
    options.employeeEmail,
    orgUnit.id,
    func.id,
    archetype.id,
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
} from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function getDefinitionMap(): Promise<Map<string, number>> {
  const rows = await db
    .select({
      id: compMatrixDefinitions.id,
      compTitle: compMatrixCompetencies.title,
      levelCode: compMatrixLevels.levelCode,
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
    );

  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(`${row.compTitle}::${row.levelCode}`, row.id);
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
    await db
      .insert(compMatrixCurrentRatings)
      .values({
        compMatrixId: matrixId,
        userCompMatrixAssignmentId: assignmentId,
        compMatrixDefinitionId: rating.definitionId,
        selfRatingId: rating.selfRatingId,
        selfComment: rating.selfComment,
        managerId,
        managerRatingId: rating.managerRatingId,
        managerComment: rating.managerComment,
      })
      .onConflictDoUpdate({
        target: [
          compMatrixCurrentRatings.userCompMatrixAssignmentId,
          compMatrixCurrentRatings.compMatrixDefinitionId,
        ],
        set: {
          selfRatingId: rating.selfRatingId,
          selfComment: rating.selfComment,
          managerId,
          managerRatingId: rating.managerRatingId,
          managerComment: rating.managerComment,
        },
      });
  }
}
