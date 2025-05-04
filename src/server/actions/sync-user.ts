import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  createUserOnFirstLogin,
  getUserByAuthProviderId,
} from "~/server/queries/users";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function syncUserToDb() {
  const clerkUser = await auth();
  if (!clerkUser.userId) throw new Error("Unauthorized");

  const existingUser = await getUserByAuthProviderId(clerkUser.userId);

  if (!existingUser) {
    const clrekUserDetails = await (
      await clerkClient()
    ).users.getUser(clerkUser.userId);

    const organizationId = getCurrentUserOrgId();

    await createUserOnFirstLogin({
      authProviderId: clerkUser.userId,
      fullName: clrekUserDetails.fullName || "",
      email: clrekUserDetails.emailAddresses[0]?.emailAddress || "",
      organizationId: organizationId,
    });
  }
}
