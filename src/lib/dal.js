import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/db";

// Verify the current session
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    userId: session.userId,
    role: session.role,
  };
});

// Return only safe user information
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// Verify that the user still exists
export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession();

  const user = await findUserById(userId);

  if (!user) {
    redirect("/login");
  }

  return toPublicUser(user);
});



export const requireAdmin = cache(async () => {
  const user = await getCurrentUser();

  // Check the latest role from the user store
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
});