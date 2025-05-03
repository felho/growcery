import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  createUserOnFirstLogin,
  getUserByAuthProviderId,
} from "~/server/queries";
import { SyncUser } from "./sync-user";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function SyncUserWrapper() {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  let organizationId: number | null = null;

  const existingUser = await getUserByAuthProviderId(clerkUser.userId);

  if (!existingUser) {
    const clrekUserDetails = await (
      await clerkClient()
    ).users.getUser(clerkUser.userId);

    organizationId = getCurrentUserOrgId();

    await createUserOnFirstLogin({
      authProviderId: clerkUser.userId,
      fullName: clrekUserDetails.fullName || "",
      email: clrekUserDetails.emailAddresses[0]?.emailAddress || "",
      organizationId: organizationId,
    });
  } else {
    organizationId = existingUser.organizationId;
  }

  return <SyncUser organizationId={organizationId} />;
}
