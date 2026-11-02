import { NextResponse } from "next/server";
import {
  verifyToken,
  signToken,
  SESSION_COOKIE,
} from "@/lib/session";

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/login", "/signup"];

function matches(pathname, routes) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyToken(token);

  // 1. Logged-out user tries to access a protected page
  if (matches(pathname, protectedRoutes) && !session) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname + search);

    const response = NextResponse.redirect(loginUrl);

    if (token) {
      response.cookies.delete(SESSION_COOKIE);
    }

    return response;
  }


  // 2. Logged-in non-admin user tries to access admin page
  if (
    matches(pathname, ["/admin"]) &&
    session?.role !== "admin"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }


  // 2. Logged-in user opens login or signup
  if (matches(pathname, authRoutes) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

 
const response = NextResponse.next();

const ONE_DAY_SECONDS = 24 * 60 * 60;

if (
  session &&
  Date.now() / 1000 - session.iat > ONE_DAY_SECONDS
) {
  const freshToken = await signToken({
    userId: session.userId,
    role: session.role,
  });

  response.cookies.set(SESSION_COOKIE, freshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  });
}

return response;

}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};