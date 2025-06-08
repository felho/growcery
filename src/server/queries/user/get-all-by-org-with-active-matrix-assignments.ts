import { db } from "~/server/db";
import { and, asc, eq } from "drizzle-orm";
import { users } from "~/server/db/schema/tables/users";
import { userCompMatrixAssignments } from "~/server/db/schema/tables/user_comp_matrix_assignments";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";
import type { UserWithArchetypeAndAssignments } from "./index";

export async function getAllUsersWithActiveMatrixAssignmentsForOrg(
  organizationId: number,
): Promise<UserWithArchetypeAndAssignments[]> {
  const results = await db
    .select({
      id: users.id,
      authProviderId: users.authProviderId,
      fullName: users.fullName,
      email: users.email,
      organizationId: users.organizationId,
      orgUnitId: users.orgUnitId,
      functionId: users.functionId,
      archetypeId: users.archetypeId,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      managerId: users.managerId,
      isManager: users.isManager,
      archetype: {
        id: userArchetypes.id,
        organizationId: userArchetypes.organizationId,
        name: userArchetypes.name,
        description: userArchetypes.description,
      },
      assignmentId: userCompMatrixAssignments.id,
      compMatrixId: userCompMatrixAssignments.compMatrixId,
    })
    .from(users)
    .innerJoin(
      userCompMatrixAssignments,
      eq(users.id, userCompMatrixAssignments.revieweeId),
    )
    .leftJoin(userArchetypes, eq(users.archetypeId, userArchetypes.id))
    .where(
      and(
        eq(users.organizationId, organizationId),
        eq(userCompMatrixAssignments.isActive, true),
      ),
    )
    .orderBy(asc(users.fullName));

  const userMap = new Map<number, UserWithArchetypeAndAssignments>();

  for (const row of results) {
    const existing = userMap.get(row.id);
    if (existing) {
      existing.userCompMatrixAssignments.push({
        id: row.assignmentId,
        compMatrixId: row.compMatrixId,
      });
    } else {
      userMap.set(row.id, {
        ...row,
        archetype: row.archetype ?? null,
        userCompMatrixAssignments: [
          {
            id: row.assignmentId,
            compMatrixId: row.compMatrixId,
          },
        ],
      });
    }
  }

  return Array.from(userMap.values());
}
