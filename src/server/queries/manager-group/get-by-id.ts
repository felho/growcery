import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { managerGroups } from "~/server/db/schema";
import type { ManagerGroupWithMembers } from ".";

export async function getManagerGroupById(
  id: number
): Promise<ManagerGroupWithMembers | null> {
  const result = await db.query.managerGroups.findFirst({
    where: (mg, { eq }) => eq(mg.id, id),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!result) return null;

  return {
    ...result,
    members: result.members.map((member) => member.user),
  };
}
