import { auth } from "@clerk/nextjs/server";
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
    user = await db.user.create({
      data: { clerkId: userId },
    });
  }

  return user;
}
