import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/fwd/auth/session";
import { getAdminPassword } from "@/lib/fwd/auth/config";

/**
 * Lightweight gate only. Auth configuration + final enforcement also run in
 * the Node `/fwd` layouts, which reliably see Vercel runtime env vars.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/fwd/sign-in")) {
    return NextResponse.next();
  }

  // If proxy cannot see the password, do not hard-fail with "not_configured".
  // Let the Node layout/sign-in page decide — that path reads runtime env.
  const adminPassword = getAdminPassword();
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/fwd", "/fwd/:path*"],
};
