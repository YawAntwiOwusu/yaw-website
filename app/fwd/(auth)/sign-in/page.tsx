import { connection } from "next/server";
import { Suspense } from "react";
import { isAdminAuthConfigured } from "@/lib/fwd/auth/config";
import { SignInForm } from "@/components/fwd/SignInForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function FwdSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const configured = isAdminAuthConfigured();
  const notConfigured =
    !configured || params.error === "not_configured";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>FWD Admin</CardTitle>
              <CardDescription>Loading…</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <SignInForm notConfigured={notConfigured} />
      </Suspense>
    </div>
  );
}
