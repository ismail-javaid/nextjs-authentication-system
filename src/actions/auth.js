"use server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { redirect } from "next/navigation";
import { signupSchema, loginSchema } from "@/lib/schemas";

import {
  createUser,
  findUserByEmail,
  verifyPassword,
  DUMMY_HASH,
} from "@/lib/db";

import { createSession, deleteSession } from "@/lib/session";

function validationError(error) {
  return {
    success: false,
    message: "Please fix the errors below.",
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

// Sirf isi website ke internal paths par redirect allow karo
function safeRedirectPath(path) {
  if (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//")
  ) {
    return path;
  }

  return "/dashboard";
}

// SIGNUP
export async function signup(input) {
  const parsed = signupSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, email, password } = parsed.data;

  if (await findUserByEmail(email)) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: {
        email: ["An account with this email already exists"],
      },
    };
  }

  const user = await createUser({ name, email, password });

  await createSession(user);

  redirect("/dashboard");
}

// LOGIN
export async function login(input, callbackUrl) {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { email, password } = parsed.data;

  const ip = (await headers())
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim() ?? "unknown";

  const limit = rateLimit(`login:${email}:${ip}`);

  if (!limit.ok) {
    return {
      success: false,
      message: `Too many attempts. Try again in ${limit.retryInMinutes} minutes.`,
    };
  }


  const user = await findUserByEmail(email);


  const passwordOk =
    (await verifyPassword(
      password,
      user?.passwordHash ?? DUMMY_HASH
    )) && user !== null;


  if (!passwordOk) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  await createSession(user);

  redirect(safeRedirectPath(callbackUrl));
}

// LOGOUT
export async function logout() {
  await deleteSession();

  redirect("/login");
}