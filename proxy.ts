import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/fwd/auth/session";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/fwd/sign-in")) {
    return NextResponse.next();
  }

  const adminPassword =
    process.env.FWD_ADMIN_PASSWORD || process.env.FIRSTDOMAIN_ADMIN_PASSWORD;

  if (!adminPassword) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Admin auth is not configured" },
        { status: 503 }
      );
    }
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
  matcher: ["/fwd/:path*"],
};
