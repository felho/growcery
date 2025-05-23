import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getUserByAuthProviderId, createUserOnFirstLogin } from "~/server/queries/user";
import { getCurrentUserOrgId } from "./get-org-id";
import { cache } from "react";

/**
 * Ensures that the authenticated user exists in the database and is properly synced.
 * This function is cached for the duration of a request to prevent multiple DB calls.
 * 
 * @returns The user's database ID
 * @throws Error if user is not authenticated or synchronization fails
 */
export const ensureUserSync = cache(async () => {
  const clerkAuth = await auth();
  if (!clerkAuth.userId) {
    throw new Error("User not authenticated");
  }

  // Check if user exists in our database
  const existingUser = await getUserByAuthProviderId(clerkAuth.userId);

  // If user exists, return their ID
  if (existingUser) {
    return existingUser.id;
  }

  // If user doesn't exist, fetch details from Clerk and create in our database
  const clerkUserDetails = await (
    await clerkClient()
  ).users.getUser(clerkAuth.userId);

  const organizationId = getCurrentUserOrgId();

  // Create the user in our database
  const newUserId = await createUserOnFirstLogin({
    authProviderId: clerkAuth.userId,
    fullName: clerkUserDetails.fullName || "",
    email: clerkUserDetails.emailAddresses[0]?.emailAddress || "",
    organizationId: organizationId,
  });

  return newUserId;
});

/**
 * A wrapper component that ensures user synchronization before rendering children.
 * This can be used in layout files to guarantee DB sync before any page loads.
 */
export async function EnsureUserSync() {
  try {
    await ensureUserSync();
  } catch (error) {
    // If there's an error, we don't need to do anything here
    // The middleware will handle redirecting unauthenticated users
    console.error("User sync error:", error);
  }
  
  return null;
}
