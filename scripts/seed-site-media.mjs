// Upload public site images to Vercel Blob, register media_assets, rewrite URLs.
// Run: npm run db:seed:media
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import * as schema from "../lib/db/schema.ts";
import { notes } from "../lib/notes.ts";
import { projects } from "../lib/projects.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const publicDir = resolve(root, "public");

function decodePublicPath(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return null;
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
    return null; // already remote
  }
  const clean = urlPath.split("?")[0].split("#")[0];
  if (!clean.startsWith("/")) return null;
  try {
    return decodeURIComponent(clean);
  } catch {
    return clean;
  }
}

function collectImagePaths() {
  const paths = new Set();

  for (const note of notes) {
    const featured = decodePublicPath(note.featuredImage);
    if (featured) paths.add(featured);

    const re = /src=["']([^"']+)["']/gi;
    let match;
    while ((match = re.exec(note.content || ""))) {
      const decoded = decodePublicPath(match[1]);
      if (decoded) paths.add(decoded);
    }
  }

  for (const project of projects) {
    const image = decodePublicPath(project.image);
    if (image) paths.add(image);
  }

  return [...paths];
}

function mimeFromExt(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is required");
    process.exit(1);
  }

  const client = neon(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });
  const imagePaths = collectImagePaths();
  console.log(`Found ${imagePaths.length} local image paths to import`);

  /** @type {Map<string, string>} old public path → blob url */
  const urlMap = new Map();
  let uploaded = 0;
  let skippedMissing = 0;
  let reused = 0;

  for (const publicPath of imagePaths) {
    const abs = resolve(publicDir, `.${publicPath}`);
    if (!existsSync(abs)) {
      console.warn(`MISSING file for ${publicPath}`);
      skippedMissing += 1;
      continue;
    }

    const existing = await db
      .select()
      .from(schema.mediaAssets)
      .where(eq(schema.mediaAssets.alt, `migrated:${publicPath}`))
      .limit(1);

    if (existing[0]) {
      urlMap.set(publicPath, existing[0].url);
      // also map encoded variants
      urlMap.set(encodeURI(publicPath), existing[0].url);
      reused += 1;
      continue;
    }

    const bytes = readFileSync(abs);
    const filename = basename(publicPath);
    const pathname = `fwd/migrated${publicPath}`;
    const blob = await put(pathname, bytes, {
      access: "public",
      contentType: mimeFromExt(publicPath),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    await db.insert(schema.mediaAssets).values({
      url: blob.url,
      pathname: blob.pathname,
      filename,
      mimeType: mimeFromExt(publicPath),
      size: bytes.length,
      alt: `migrated:${publicPath}`,
      productSlug: "site",
    });

    urlMap.set(publicPath, blob.url);
    urlMap.set(encodeURI(publicPath), blob.url);
    uploaded += 1;
    console.log(`Uploaded ${publicPath} → ${blob.url}`);
  }

  function rewriteUrl(url) {
    if (!url) return url;
    const decoded = decodePublicPath(url);
    if (decoded && urlMap.has(decoded)) return urlMap.get(decoded);
    if (urlMap.has(url)) return urlMap.get(url);
    try {
      const dec = decodeURIComponent(url.split("?")[0]);
      if (urlMap.has(dec)) return urlMap.get(dec);
    } catch {
      // ignore
    }
    return url;
  }

  function rewriteHtml(html) {
    if (!html) return html;
    return html.replace(/src=["']([^"']+)["']/gi, (full, src) => {
      const next = rewriteUrl(src);
      if (next === src) return full;
      const quote = full.includes('"') ? '"' : "'";
      return `src=${quote}${next}${quote}`;
    });
  }

  const allPosts = await db.select().from(schema.posts);
  let postsRewritten = 0;
  for (const post of allPosts) {
    const featuredImageUrl = rewriteUrl(post.featuredImageUrl) || post.featuredImageUrl;
    const content = rewriteHtml(post.content);
    if (
      featuredImageUrl !== post.featuredImageUrl ||
      content !== post.content
    ) {
      await db
        .update(schema.posts)
        .set({
          featuredImageUrl,
          content,
          updatedAt: new Date(),
        })
        .where(eq(schema.posts.id, post.id));
      postsRewritten += 1;
    }
  }

  const allProjects = await db.select().from(schema.projects);
  let projectsRewritten = 0;
  for (const project of allProjects) {
    const image = rewriteUrl(project.image) || project.image;
    if (image !== project.image) {
      await db
        .update(schema.projects)
        .set({ image, updatedAt: new Date() })
        .where(eq(schema.projects.id, project.id));
      projectsRewritten += 1;
    }
  }

  console.log(
    `Media: ${uploaded} uploaded, ${reused} reused, ${skippedMissing} missing files`
  );
  console.log(
    `Rewrote URLs on ${postsRewritten} posts and ${projectsRewritten} projects`
  );
  console.log("Media seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
