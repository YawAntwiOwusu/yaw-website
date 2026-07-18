/**
 * Central place to read FWD admin env vars.
 * Trims values so accidental whitespace in Vercel doesn't look "set but empty".
 */

export function getAdminPassword(): string | undefined {
  const value = (
    process.env.FWD_ADMIN_PASSWORD ||
    process.env.FIRSTDOMAIN_ADMIN_PASSWORD ||
    ""
  ).trim();
  return value || undefined;
}

export function getSessionSecret(): string | undefined {
  const value = (
    process.env.FWD_SESSION_SECRET ||
    process.env.FIRSTDOMAIN_SESSION_SECRET ||
    process.env.FWD_ADMIN_PASSWORD ||
    process.env.FIRSTDOMAIN_ADMIN_PASSWORD ||
    ""
  ).trim();
  return value || undefined;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword() && getSessionSecret());
}
