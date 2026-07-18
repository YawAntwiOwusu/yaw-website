import { NextResponse } from "next/server";
import { connection } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { isAdminAuthConfigured, getAdminPassword } from "@/lib/fwd/auth/config";

export const dynamic = "force-dynamic";

/**
 * Runtime diagnostic for Vercel env wiring (no secrets returned).
 * GET /api/fwd/auth-status
 */
export async function GET() {
  noStore();
  await connection();

  const password = getAdminPassword();
  const configured = isAdminAuthConfigured();

  return NextResponse.json(
    {
      configured,
      hasPassword: Boolean(password),
      passwordLength: password?.length ?? 0,
      hasSessionSecret: Boolean(
        (
          process.env.FWD_SESSION_SECRET ||
          process.env.FIRSTDOMAIN_SESSION_SECRET ||
          ""
        ).trim()
      ),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
