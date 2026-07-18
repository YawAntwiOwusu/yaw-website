import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/fwd/auth/session";
import { getAdminPassword } from "@/lib/fwd/auth/config";

/**
 * Soft gate only. Final auth + env checks happen in the Node /fwd layout
 * so Vercel runtime secrets are read per-request (not from a prerender cache).
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/fwd/sign-in")) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const adminPassword = getAdminPassword();
  // If proxy can't see the password, let the Node layout decide.
  if (!adminPassword) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ||
    request.cookies.get(LEGACY_ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const signInUrl = new URL("/fwd/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  matcher: ["/fwd", "/fwd/:path*"],
};
