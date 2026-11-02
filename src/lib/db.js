import "server-only";
import bcrypt from "bcryptjs";

// In-memory user store
const users =
  globalThis.__users ?? (globalThis.__users = new Map());

// Find user by email
export async function findUserByEmail(email) {
  return users.get(email) ?? null;
}

// Find user by ID
export async function findUserById(id) {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }

  return null;
}

// Create new user

export async function createUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    role: adminEmails.includes(email.toLowerCase())
      ? "admin"
      : "user",
    createdAt: new Date().toISOString(),
  };

  users.set(email, user);
  return user;
}


// Verify password
export async function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export const DUMMY_HASH = bcrypt.hashSync(
  "timing-safe-dummy-password",
  12
);