import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  // Check whether the user is logged in
  if (!session?.userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Find the logged-in user
  const user = await findUserById(session.userId);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Return only public user information
  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}