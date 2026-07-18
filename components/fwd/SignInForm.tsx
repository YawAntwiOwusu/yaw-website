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

export function SignInForm({ notConfigured }: { notConfigured: boolean }) {
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
              This deployment still cannot read the admin env vars at runtime.
              In Vercel, confirm both are set for the same environment you are
              visiting (Production vs Preview):
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
              <li>FWD_ADMIN_PASSWORD</li>
              <li>FWD_SESSION_SECRET</li>
            </ul>
            <p className="mt-2">
              Checklist: no extra quotes, no trailing spaces, enabled for{" "}
              <strong>Production</strong> (and Preview if using preview URLs),
              then trigger a <strong>new deploy</strong> after saving.
            </p>
            <p className="mt-2">
              Locally: values go in <code>.env.local</code>, then restart{" "}
              <code>npm run dev</code>.
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
