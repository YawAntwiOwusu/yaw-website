"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_DURATION_MS,
  createSessionToken,
  verifySessionToken,
} from "./session";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (!valid) {
    throw new Error("Unauthorized");
  }
  return { admin: true as const };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const password = formData.get("password");
  const adminPassword = process.env.FIRSTDOMAIN_ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Admin password is not configured" };
  }

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Password is required" };
  }

  // Constant-time comparison
  const a = password;
  const b = adminPassword;
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < b.length; i++) {
    mismatch |= a.charCodeAt(i % a.length) ^ b.charCodeAt(i);
  }

  if (mismatch !== 0) {
    return { error: "Incorrect password" };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });

  redirect("/firstdomain/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/firstdomain/admin/sign-in");
}
