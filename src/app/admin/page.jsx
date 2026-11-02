
import { requireAdmin } from "@/lib/dal";

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Admin Panel
      </h1>

      <p>
        Only admins see this. Hello, {admin.name}.
      </p>
    </main>
  );
}