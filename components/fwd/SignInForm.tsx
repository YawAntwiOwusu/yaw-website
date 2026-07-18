"use client";

import { useActionState } from "react";
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

export function SignInForm() {
  const [state, formAction, pending] = useActionState(loginAction, {
    error: null,
  });

  const configError =
    Boolean(state.error) &&
    /not configured|session secret/i.test(state.error ?? "");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>FWD Admin</CardTitle>
        <CardDescription>
          Enter the admin password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {configError && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
            <p className="font-medium">Admin auth env vars missing at runtime</p>
            <p className="mt-1">
              In Vercel → Project Settings → Environment Variables, set both for{" "}
              <strong>Production</strong> (and Preview if needed):
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
              <li>FWD_ADMIN_PASSWORD</li>
              <li>FWD_SESSION_SECRET</li>
            </ul>
            <p className="mt-2">
              No quotes in the Vercel UI. After saving, use{" "}
              <strong>Deployments → … → Redeploy</strong> (not only “retry”).
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
            />
          </div>
          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
