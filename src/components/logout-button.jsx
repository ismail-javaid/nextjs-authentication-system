import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="underline">
        Log out
      </button>
    </form>
  );
}