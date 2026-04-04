/** Canonical site origin for metadata, OG tags, and share URLs. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://yawantwiowusu.com"
) as string;

export const siteMetadataBase = new URL(`${SITE_URL}/`);

/** Absolute URL for a path or already-absolute URL (e.g. featured image for OG). */
export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

/** Short plain-text description for meta tags and share previews. */
export function noteMetaDescription(note: {
  excerpt?: string;
  title: string;
}): string {
  const raw = (note.excerpt ?? note.title).replace(/\s+/g, " ").trim();
  if (raw.length <= 160) return raw;
  return `${raw.slice(0, 157).trim()}…`;
}
