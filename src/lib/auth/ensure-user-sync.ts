import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getUserByAuthProviderId, createUserOnFirstLogin } from "~/server/queries/user";
import { getCurrentUserOrgId } from "./get-org-id";
// import { cache } from "react"; -- Temporarily removed for testing
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Ensures that the authenticated user exists in the database and is properly synced.
 * This function is cached for the duration of a request to prevent multiple DB calls.
 * 
 * @returns The user's database ID
 * @throws Error if user is not authenticated or synchronization fails
 */
export const ensureUserSync = async () => {
  const clerkAuth = await auth();
  if (!clerkAuth.userId) {
    throw new Error("User not authenticated");
  }

  // Check if user exists in our database by authProviderId
  const existingUserByAuthId = await getUserByAuthProviderId(clerkAuth.userId);

  // If user exists by authProviderId, return their ID
  if (existingUserByAuthId) {
    return existingUserByAuthId.id;
  }

  // If user doesn't exist, fetch details from Clerk and create in our database
  const clerkUserDetails = await (
    await clerkClient()
  ).users.getUser(clerkAuth.userId);

  const organizationId = getCurrentUserOrgId();

  // Get first and last name from Clerk
  const firstName = clerkUserDetails.firstName || "";
  const lastName = clerkUserDetails.lastName || "";
  
  // Combine first and last name for fullName field
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  
  // Get the email address from Clerk
  const email = clerkUserDetails.emailAddresses[0]?.emailAddress || "";
  
  // Próbáljuk meg először lekérni a felhasználót az email cím alapján
  let newUserId: number;
  
  // Lekérjük a felhasználót az email cím alapján közvetlen SQL lekérdezéssel
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then(rows => rows[0] || null) as typeof users.$inferSelect | null;
  
  if (existingUser) {
    // Ha már létezik felhasználó, ellenőrizzük, hogy szükséges-e frissíteni az adatokat
    const needsUpdate = (
      // Frissítjük az authProviderId-t, ha változott
      existingUser.authProviderId !== clerkAuth.userId ||
      // Frissítjük a fullName-et, ha üres vagy változott és az új érték nem üres
      ((existingUser.fullName === "" || existingUser.fullName !== fullName) && fullName !== "")
    );
    
    if (needsUpdate) {
      // Elkészítjük a frissítési adatokat
      const updateData: { authProviderId?: string; fullName?: string } = {};
      
      if (existingUser.authProviderId !== clerkAuth.userId) {
        updateData.authProviderId = clerkAuth.userId;
      }
      
      if ((existingUser.fullName === "" || existingUser.fullName !== fullName) && fullName !== "") {
        updateData.fullName = fullName;
      }
      
      // Frissítjük az adatokat
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, existingUser.id));
      
      console.log(`User data updated for ID ${existingUser.id}:`, updateData);
    }
    
    newUserId = existingUser.id;
  } else {
    // Ha nem létezik még felhasználó, akkor létrehozzuk
    try {
      newUserId = await createUserOnFirstLogin({
        authProviderId: clerkAuth.userId,
        fullName: fullName || clerkUserDetails.fullName || "", // Use combined name or fallback to fullName
        email: email,
        organizationId: organizationId,
      });
    } catch (error) {
      // Ha duplikált email hiba történik, próbáljuk meg újra lekérni a felhasználót
      // (versenyhelyzet miatt előfordulhat, hogy közben már létrehozta egy másik kérés)
      if (error instanceof Error && error.message.includes("duplicate key value")) {
        console.log("Duplicate email found due to race condition, trying to get user by email again...");
        
        // Lekérjük a felhasználót az email cím alapján közvetlen SQL lekérdezéssel
        const racedUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
          .then(rows => rows[0] || null) as typeof users.$inferSelect | null;
        
        if (racedUser) {
          // Ha találtunk felhasználót, frissítsük az authProviderId-t, ha szükséges
          if (racedUser.authProviderId !== clerkAuth.userId) {
            await db
              .update(users)
              .set({ authProviderId: clerkAuth.userId })
              .where(eq(users.id, racedUser.id));
          }
          
          newUserId = racedUser.id;
        } else {
          // Ha még mindig nem találtunk felhasználót, dobjuk tovább a hibát
          throw error;
        }
      } else {
        // Ha más hiba történt, dobjuk tovább
        throw error;
      }
    }
  }

  return newUserId;
};

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
