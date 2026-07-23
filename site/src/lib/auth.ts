/**
 * Clerk auth configuration.
 * 
 * These env vars are needed:
 *   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - from Clerk dashboard (frontend API key)
 *   CLERK_SECRET_KEY                  - from Clerk dashboard (secret key)
 * 
 * The owner connects Clerk via the auth tool card which provides these keys.
 */

import { createClerkClient } from "@clerk/backend";

// Client-side publishable key (public, safe to embed)
export const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

// Server-side secret key (used in server functions and API routes)
export const getClerkServer = () => {
  const key = process.env.CLERK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "CLERK_SECRET_KEY is not set — connect Clerk (via the auth card) before using server auth.",
    );
  }
  return createClerkClient({ secretKey: key });
};
