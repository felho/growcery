import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";
import { users } from "~/server/db/schema/tables/users";
import { userCompMatrixAssignments } from "~/server/db/schema/tables/user_comp_matrix_assignments";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";
import type { UserWithArchetype } from "./index";

export async function getAllUsersWithActiveMatrixAssignmentsForOrg(
  organizationId: number,
): Promise<UserWithArchetype[]> {
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
      archetype: {
        id: userArchetypes.id,
        organizationId: userArchetypes.organizationId,
        name: userArchetypes.name,
        description: userArchetypes.description,
      },
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
    );

  return results.map((row) => ({
    ...row,
    archetype: row.archetype ?? null,
  }));
}
