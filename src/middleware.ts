import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { SessionUser } from "@/types";

const COOKIE_NAME = "kulup_session";

async function getUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as SessionUser;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getUserFromRequest(request);

  const isPublic = pathname === "/login" || pathname.startsWith("/api/auth/login");

  if (!user && !isPublic && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL(getHomeForRole(user.role), request.url));
  }

  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/favorites") || pathname.startsWith("/my-events")) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (pathname.startsWith("/favorites") || pathname.startsWith("/my-events")) &&
    user?.role !== "STUDENT"
  ) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  if (pathname.startsWith("/president") && user?.role !== "CLUB_PRESIDENT") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function getHomeForRole(role: SessionUser["role"]) {
  switch (role) {
    case "ADMIN":
      return "/admin/reports";
    case "CLUB_PRESIDENT":
      return "/president/events";
    default:
      return "/events";
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
