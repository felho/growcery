import { db } from "~/server/db";
import { and, asc, eq } from "drizzle-orm";
import { users } from "~/server/db/schema/tables/users";
import { userCompMatrixAssignments } from "~/server/db/schema/tables/user_comp_matrix_assignments";
import { userArchetypes } from "~/server/db/schema/tables/user-archetypes";
import { compMatrices } from "~/server/db/schema/tables/comp-matrices";
import type { UserWithArchetype } from "./index";

export type UserWithActiveMatrixName = UserWithArchetype & {
  activeMatrix: {
    id: number;
    title: string;
  } | null;
};

export async function getAllUsersWithActiveMatrixName(
  organizationId: number,
): Promise<UserWithActiveMatrixName[]> {
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
      activeMatrixId: userCompMatrixAssignments.id,
      matrixTitle: compMatrices.title,
    })
    .from(users)
    .leftJoin(
      userCompMatrixAssignments,
      and(
        eq(users.id, userCompMatrixAssignments.revieweeId),
        eq(userCompMatrixAssignments.isActive, true),
      ),
    )
    .leftJoin(compMatrices, eq(userCompMatrixAssignments.compMatrixId, compMatrices.id))
    .leftJoin(userArchetypes, eq(users.archetypeId, userArchetypes.id))
    .where(eq(users.organizationId, organizationId))
    .orderBy(asc(users.fullName));

  return results.map((row) => {
    // Kiszűrjük a nem szükséges mezőket és biztosítjuk a helyes típusokat
    const user: UserWithActiveMatrixName = {
      id: row.id,
      authProviderId: row.authProviderId,
      fullName: row.fullName,
      email: row.email,
      organizationId: row.organizationId,
      orgUnitId: row.orgUnitId,
      functionId: row.functionId,
      archetypeId: row.archetypeId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      managerId: row.managerId,
      isManager: row.isManager,
      archetype: row.archetype ?? null,
      activeMatrix: row.activeMatrixId && row.matrixTitle
        ? {
            id: row.activeMatrixId,
            title: row.matrixTitle,
          }
        : null,
    };
    return user;
  });
}
