import { db } from "~/server/db";
import type { ManagerGroupWithMembers } from ".";

export async function getAllManagerGroupsForOrg(
  organizationId: number,
): Promise<ManagerGroupWithMembers[]> {
  const groups = await db.query.managerGroups.findMany({
    where: (mg, { eq }) => eq(mg.organizationId, organizationId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });

  return groups.map((group) => ({
    ...group,
    members: group.members.map((member) => member.user),
  }));
}
