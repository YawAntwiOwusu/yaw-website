import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/fwd/auth/session";

function redirectToSignIn(request: NextRequest, reason?: string) {
  const signInUrl = new URL("/fwd/sign-in", request.url);
  if (reason) signInUrl.searchParams.set("error", reason);
  return NextResponse.redirect(signInUrl);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/fwd/sign-in")) {
    return NextResponse.next();
  }

  const adminPassword =
    process.env.FWD_ADMIN_PASSWORD || process.env.FIRSTDOMAIN_ADMIN_PASSWORD;

  if (!adminPassword) {
    // Always send humans to the sign-in screen with setup guidance.
    // (Avoid raw JSON 503 on /fwd in production.)
    return redirectToSignIn(request, "not_configured");
  }

  const token =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ||
    request.cookies.get(LEGACY_ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    return redirectToSignIn(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/fwd", "/fwd/:path*"],
};
