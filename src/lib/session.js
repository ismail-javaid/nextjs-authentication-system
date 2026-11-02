import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is missing from .env.local");
}

const key = new TextEncoder().encode(secret);

// 1. Sign a payload into a JWT string
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

// 2. Verify a JWT string
export async function verifyToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch {
    return null;
  }
}

// 3. Create the cookie after a successful signup/login
export async function createSession(user) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const token = await signToken({
    userId: user.id,
    role: user.role,
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// 4. Read and verify the current session
export async function getSession() {
  const cookieStore = await cookies();

  return verifyToken(cookieStore.get(SESSION_COOKIE)?.value);
}

// 5. Log out
export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}