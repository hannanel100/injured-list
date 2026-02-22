import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * Get or create a User record in our database for the currently
 * authenticated Clerk user (lazy-sync approach).
 */
export async function getOrCreateDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await db.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    const clerkUser = await currentUser();
    const displayName =
      clerkUser?.firstName && clerkUser?.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser?.firstName ||
          clerkUser?.emailAddresses?.[0]?.emailAddress ||
          null;

    user = await db.user.create({
      data: { clerkId: userId, displayName },
    });
  } else if (!user.displayName) {
    // Backfill displayName for existing users
    const clerkUser = await currentUser();
    const displayName =
      clerkUser?.firstName && clerkUser?.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser?.firstName ||
          clerkUser?.emailAddresses?.[0]?.emailAddress ||
          null;

    if (displayName) {
      user = await db.user.update({
        where: { id: user.id },
        data: { displayName },
      });
    }
  }

  return user;
}
