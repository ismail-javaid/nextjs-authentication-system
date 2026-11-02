"use server";

import { z } from "zod";
import { verifySession } from "@/lib/dal";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(50),
});

export async function updateProfile(input) {
  const { userId } = await verifySession();

  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // Profile update will be connected to a persistent database later.
  // For now, this action validates the session and input only.

  return {
    success: true,
    message: "Profile data validated.",
    userId,
  };
}