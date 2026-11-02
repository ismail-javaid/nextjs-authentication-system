import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({ searchParams }) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Log in
      </h1>

      <LoginForm callbackUrl={callbackUrl} />

      <p className="mt-4 text-sm">
        No account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}