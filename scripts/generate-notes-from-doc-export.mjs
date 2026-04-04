/**
 * One-off: parses Google Doc plain-text export and writes lib/notes.ts
 * Source: docs/articles-backup-export.txt or pass path as argv[2]
 *
 * SEO / sharing: each note's title, excerpt, category, datePublished, and featuredImage
 * feed app/[slug]/page.tsx (Open Graph, Twitter, JSON-LD) and social previews. Keep excerpts substantive.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const EXPORT_PATH =
  process.argv[2] || path.join(root, "docs", "articles-backup-export.txt");

const IMG_BASE = "/images/Articles%20backup%20picture";
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const publicImagesDir = path.join(root, "public", "images", "Articles backup picture");

const FEATURED = [
  `${IMG_BASE}/%231/1520090716383.jpeg`,
  `${IMG_BASE}/%232/yaw-antwi-owusu-music-articles.png`,
  `${IMG_BASE}/%233/Yaw-Antwi-Owusu-at-Kwahu-Ridge-SHTS-as-Graphic-Design-teacher.jpg`,
  `${IMG_BASE}/%234/Stats-on-Yaw-Antwi-Owusu-Webinar.png`,
  `${IMG_BASE}/%235/2020-goes-home.jpg`,
  `${IMG_BASE}/%236/IMG_20210322_105852_321.jpg`,
  `${IMG_BASE}/%237/Yaw-Antwi-Owusu-1-scaled.jpg`,
  `${IMG_BASE}/%238/Yaw-Antwi-Owusu-Featured-image.jpg`,
  `${IMG_BASE}/%239/Somto-pitching-Egaloe-at-MEST-Africa-Guest-Lecture-weekend-1-2048x1365.jpg`,
  `${IMG_BASE}/%2310/Kwahu-Easter-Festival-2022-was-memorable-but-it-could-even-get-better.jpg`,
  `${IMG_BASE}/%2311/Yaw-Antwi-Owusu-Co-founders-of-Ubadi-Technologies-1920x1440.jpg`,
  `${IMG_BASE}/%2312/Yaw-Antwi-Owusu-Product-Development-and-Growth-Specialist.jpg`,
  `${IMG_BASE}/%2313/1765143453729.jpeg`,
  `${IMG_BASE}/%2314/1755502670717.jpeg`,
  `${IMG_BASE}/%2315/1756110163115.jpeg`,
  `${IMG_BASE}/%2316/featured%20image.jpeg`,
  `${IMG_BASE}/%2317/featured%20image.jpeg`,
  `${IMG_BASE}/%2318/featured%20image.jpeg`,
];

function featuredBasename(index) {
  const u = FEATURED[index] || "";
  const seg = u.split("/").pop() || "";
  try {
    return decodeURIComponent(seg);
  } catch {
    return seg;
  }
}

/** Public URL for an image in article folder # (index+1). */
function imagePublicUrl(articleIndex, filename) {
  const hashSeg = `%23${articleIndex + 1}`;
  const encName = encodeURIComponent(filename);
  return `${IMG_BASE}/${hashSeg}/${encName}`;
}

/** Non-featured image URLs for this article (sorted by filename). */
function getExtraImageUrls(articleIndex) {
  const folder = path.join(publicImagesDir, `#${articleIndex + 1}`);
  if (!fs.existsSync(folder)) return [];
  const featured = featuredBasename(articleIndex);
  return fs
    .readdirSync(folder)
    .filter((f) => IMAGE_EXT.test(f) && f !== featured)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((f) => imagePublicUrl(articleIndex, f));
}

function altFromUrl(url) {
  const base = (url.split("/").pop() || "Photo").split("?")[0];
  try {
    return decodeURIComponent(base).replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  } catch {
    return base.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  }
}

function buildFigure(url) {
  const alt = altFromUrl(url);
  return `\n      <figure class="my-8 not-prose"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" class="w-full rounded-xl object-contain max-h-[min(70vh,720px)] bg-neutral-50" loading="lazy" decoding="async" /></figure>`;
}

/** Placeholder Instagram blocks → real photos when we have extras. */
function injectAfterInstagramBlocks(html, extras) {
  const re =
    /<p>View this post on Instagram<\/p>\s*<p>A post shared by[^<]*<\/p>/gi;
  return html.replace(re, (block) => {
    if (!extras.length) return block;
    return block + buildFigure(extras.shift());
  });
}

/**
 * After </h3>, insert one image per heading (consumes extras).
 * If there is only one extra but several headings, skip the first heading so captions like
 * "Somto pitching…" keep the hero shot and the extra lands under "Team Egaloe…".
 */
function injectAfterHeadings(html, extras) {
  if (!extras.length) return html;
  const marker = "</h3>";
  const h3Count = (html.match(/<\/h3>/gi) || []).length;
  let startAt = 1;
  if (extras.length === 1 && h3Count >= 2) startAt = 2;

  let pos = 0;
  let out = "";
  let h3Index = 0;
  while (true) {
    const i = html.indexOf(marker, pos);
    if (i === -1) {
      out += html.slice(pos);
      break;
    }
    h3Index += 1;
    out += html.slice(pos, i + marker.length);
    pos = i + marker.length;
    if (h3Index >= startAt && extras.length > 0) {
      out += buildFigure(extras.shift());
    }
  }
  return out;
}

function appendRemainingImages(html, extras) {
  if (!extras.length) return html;
  const inner = extras.splice(0).map((u) => buildFigure(u)).join("");
  return (
    html +
    `\n      <div class="note-extra-images mt-12 space-y-8 max-w-full not-prose">${inner}\n      </div>`
  );
}

function bodyToHtmlWithInlineImages(bodyRaw, articleIndex) {
  let html = bodyToHtml(bodyRaw);
  const extras = getExtraImageUrls(articleIndex);
  html = injectAfterInstagramBlocks(html, extras);
  html = injectAfterHeadings(html, extras);
  html = appendRemainingImages(html, extras);
  return html;
}

function mapCategory(line) {
  const l = line.trim();
  if (/Podcasting/i.test(l)) return "Podcasting";
  if (/^Music/i.test(l)) return "Music";
  if (/Thoughts/i.test(l)) return "Thoughts";
  if (/Product\s*Musings/i.test(l)) return "Product Musings";
  if (/Entrepreneurship\s+in\s+Ghana/i.test(l)) return "Entrepreneurship in Ghana";
  if (/Career/i.test(l) && !/Personal/i.test(l)) return "Career";
  if (/Entrepreneur/i.test(l) || /Personal Life/i.test(l)) return "Personal Life";
  return "Personal Notes";
}

function parseDate(s) {
  const m = s.trim().match(/^(\d{3,4})\/(\d{1,2})\/(\d{1,2})/);
  if (!m) return "2019-01-01";
  let y = m[1];
  if (y.length === 3) {
    y = y.startsWith("0") ? `20${y.slice(1)}` : `2${y.slice(1)}`;
  }
  const mo = m[2].padStart(2, "0");
  const d = m[3].padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkify(s) {
  return s.replace(/https?:\/\/[^\s<]+/g, (url) => {
    const clean = url.replace(/[),.;]+$/, "");
    const trail = url.slice(clean.length);
    return `<a href="${escapeHtml(clean)}" target="_blank" rel="noopener noreferrer">${escapeHtml(clean)}</a>${escapeHtml(trail)}`;
  });
}

function isCorruptLine(line) {
  return /^\w+\{r\$/.test(line) || (line.includes("{") && line.includes("$"));
}

/**
 * Plain-text export from Google Docs: paragraph breaks are usually single newlines;
 * blank lines often appear as doubled/tripled spacing between sections. Map that to HTML:
 * - one non-empty line → one <p> (preserves per-paragraph spacing like the doc)
 * - 2+ consecutive blank lines → extra vertical gap (section breathing room)
 */
function bodyToHtml(raw) {
  const lines = raw
    .trim()
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => !/^Body & Pictures:/i.test(l) && !isCorruptLine(l));

  const parts = [];
  let consecutiveBlanks = 0;

  function pushDocSectionGap() {
    parts.push('<p class="note-doc-section-gap" aria-hidden="true"></p>');
  }

  for (const line of lines) {
    if (!line) {
      consecutiveBlanks++;
      continue;
    }

    if (consecutiveBlanks >= 2 && parts.length > 0) {
      pushDocSectionGap();
    }
    consecutiveBlanks = 0;

    if (/^https?:\/\//.test(line)) {
      parts.push(
        `<p><a href="${escapeHtml(line)}" target="_blank" rel="noopener noreferrer">${escapeHtml(line)}</a></p>`
      );
      continue;
    }
    if (/^View this post on Instagram$/i.test(line) || /^A post shared by/i.test(line)) {
      parts.push(`<p>${escapeHtml(line)}</p>`);
      continue;
    }
    const looksLikeProse =
      line.length > 25 && /[.!?]\s/.test(line);
    if (
      line.length < 88 &&
      !line.endsWith(".") &&
      !line.endsWith("?") &&
      !line.endsWith("!") &&
      !/^https?:/.test(line) &&
      !/^\d+\.\s/.test(line) &&
      !/^[—–-]\s/.test(line) &&
      !looksLikeProse &&
      line.length > 2
    ) {
      parts.push(`<h3>${escapeHtml(line)}</h3>`);
      continue;
    }
    parts.push(`<p>${linkify(escapeHtml(line))}</p>`);
  }
  return "\n      " + parts.join("\n      ") + "\n    ";
}

function parseArticle(block, index) {
  const title = (block.match(/^\s*Title:\s*(.+)$/m) || [])[1]?.trim();
  const catLine = (block.match(/^\s*Category:\s*(.+)$/m) || [])[1]?.trim();
  const dateLine = (block.match(/^\s*Date published:\s*(.+)$/m) || [])[1]?.trim();
  const urlLine = (block.match(/^\s*URL:\s*(.+)$/m) || [])[1]?.trim();
  if (!title) return null;
  const slugMatch = urlLine?.match(/yawantwiowusu\.com\/([^/\s]+)/i);
  let slug = slugMatch?.[1]?.replace(/\/$/, "") || "";
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  const bodyIdx = block.indexOf("Body & Pictures:");
  const bodyRaw = bodyIdx >= 0 ? block.slice(bodyIdx + "Body & Pictures:".length) : "";
  const content = bodyToHtmlWithInlineImages(bodyRaw, index);
  const excerpt = bodyRaw
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220)
    .replace(/\s+\S*$/, "") + "…";
  return {
    slug,
    title: title.replace(/\s+$/, ""),
    category: mapCategory(catLine || "Personal Life"),
    datePublished: parseDate(dateLine || "2019-01-01"),
    featuredImage: FEATURED[index] || FEATURED[0],
    content,
    excerpt,
  };
}

const raw = fs.readFileSync(EXPORT_PATH, "utf8");
const chunks = raw.split(/^Number:\s*\d+\s*$/m).slice(1);
const notes = chunks.map((c, i) => parseArticle(c, i)).filter(Boolean);

const header = `import { Note, NoteCategory } from "@/types/note";

/* Generated from Google Doc backup + featured + inline images under public/images/Articles backup picture/#N/
 * Paragraphs follow each export line; 2+ blank lines → .note-doc-section-gap (see globals.css).
 * Regenerate: node scripts/generate-notes-from-doc-export.mjs <path-to-export.txt>
 * Meta/sharing: title, excerpt, category, datePublished, featuredImage → OG/Twitter/JSON-LD (see app/[slug]/page.tsx).
 */

export const notes: Note[] = [
`;

const noteToTs = (n) => `  {
    slug: ${JSON.stringify(n.slug)},
    title: ${JSON.stringify(n.title)},
    category: ${JSON.stringify(n.category)} as NoteCategory,
    datePublished: ${JSON.stringify(n.datePublished)},
    featuredImage: ${JSON.stringify(n.featuredImage)},
    content: \`
    ${n.content.trim()}\`,
    excerpt: ${JSON.stringify(n.excerpt)},
  }`;

const footer = `
];

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}

export function getAllNotes(): Note[] {
  return notes.sort(
    (a, b) =>
      new Date(b.datePublished).getTime() -
      new Date(a.datePublished).getTime()
  );
}

export function getNotesByCategory(category: NoteCategory): Note[] {
  return notes
    .filter((note) => note.category === category)
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() -
        new Date(a.datePublished).getTime()
    );
}

export { formatDate } from "./format-note-date";
`;

const out = header + notes.map(noteToTs).join(",\n") + "," + footer;
fs.writeFileSync(path.join(root, "lib/notes.ts"), out, "utf8");
console.log("Wrote", notes.length, "notes to lib/notes.ts");
