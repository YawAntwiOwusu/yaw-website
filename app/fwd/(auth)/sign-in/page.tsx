"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "@/lib/fwd/auth/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SignInForm() {
  const searchParams = useSearchParams();
  const notConfigured = searchParams.get("error") === "not_configured";
  const [state, formAction, pending] = useActionState(loginAction, {
    error: null,
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>FWD Admin</CardTitle>
        <CardDescription>
          Enter the admin password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notConfigured && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
            <p className="font-medium">Admin auth is not configured</p>
            <p className="mt-1">
              Set these env vars, then redeploy / restart the server:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
              <li>FWD_ADMIN_PASSWORD</li>
              <li>FWD_SESSION_SECRET</li>
            </ul>
            <p className="mt-2">
              Locally: copy <code>.env.example</code> →{" "}
              <code>.env.local</code>, fill values, run{" "}
              <code>npm run dev</code>.
            </p>
            <p className="mt-1">
              On Vercel: Project Settings → Environment Variables → add both,
              then redeploy.
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              disabled={notConfigured}
            />
          </div>
          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={pending || notConfigured}
          >
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function FwdSignInPage() {
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
        <SignInForm />
      </Suspense>
    </div>
  );
}
