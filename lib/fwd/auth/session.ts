export const ADMIN_SESSION_COOKIE = "fwd_admin_session";
/** Accept legacy First Domain cookie during cutover. */
export const LEGACY_ADMIN_SESSION_COOKIE = "fd_admin_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  return (
    process.env.FWD_SESSION_SECRET ||
    process.env.FIRSTDOMAIN_SESSION_SECRET ||
    process.env.FWD_ADMIN_PASSWORD ||
    process.env.FIRSTDOMAIN_ADMIN_PASSWORD ||
    ""
  );
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  let binary = "";
  for (const byte of new Uint8Array(signature)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("FWD_SESSION_SECRET is not configured");
  const expiry = String(Date.now() + SESSION_DURATION_MS);
  const signature = await hmacSign(expiry, secret);
  return `${expiry}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;

  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || expiryMs < Date.now()) return false;

  const expected = await hmacSign(expiry, secret);
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
