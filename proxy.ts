import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/firstdomain/auth/session";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/firstdomain/admin/sign-in")) {
    return NextResponse.next();
  }

  if (!process.env.FIRSTDOMAIN_ADMIN_PASSWORD) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Admin auth is not configured" },
        { status: 503 }
      );
    }
    // In development, allow access so the admin can be explored before
    // env vars are configured.
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const signInUrl = new URL("/firstdomain/admin/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/firstdomain/admin/:path*"],
};
