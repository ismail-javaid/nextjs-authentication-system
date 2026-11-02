import { getCurrentUser } from "@/lib/dal";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">
        Welcome, {user.name}
      </h1>

      <p>
        You are signed in as {user.email} (role: {user.role}).
      </p>

      <LogoutButton />
    </main>
  );
}