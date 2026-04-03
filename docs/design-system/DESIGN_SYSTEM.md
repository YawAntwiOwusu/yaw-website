# Design System — Yaw Website

Single source of truth for the site design. Reference images live in `docs/design-system/screens/`. Update the checklists as samples are added and when each part is implemented.

---

## Notes (List, Single, Formatting, Metadata, Related, OG Image)

Design structure for notes: list view, single-note view, text formatting, featured image and metadata, related articles, and automatic featured image for link sharing.

**Reference screenshots (saved in repo):**

| # | Purpose | File |
|---|--------|------|
| 1 | List of notes | `screens/notes-list.png` |
| 2 | Single note — conclusion / body text formatting | `screens/note-conclusion.png` |
| 3 | Single note — article body, headings, spacing | `screens/note-article-body.png` |
| 4 | Related articles / READ MORE grid | `screens/notes-related-read-more.png` |
| 5 | Single note — bullet list formatting | `screens/note-bullet-list.png` |
| 6 | Single note — open layout, title, metadata, featured image | `screens/note-open-featured-metadata.png` |

**Checklist**

- [x] Notes list — sample received
- [x] Note opened (layout, featured image, metadata) — sample received
- [x] Text formatting (headings, body, lists, links) — sample received
- [x] Related articles section — sample received
- [x] Featured image = OG image for sharing — requirement captured
- [x] Notes design implemented in code (list on home tab, single note + related + OG)

---

### 1. When there are a list of notes

- **Background:** White.
- **Layout:** Vertical list; each note is one row. Thin light gray horizontal divider between rows.
- **Per-row layout:** Two columns — **featured image on the left**, **text block on the right**.
  - **Image:** Rectangular thumbnail, consistent size; can be graphic/illustration or photo.
  - **Text block:**
    - **Title:** Large, bold, black sans-serif; primary focus.
    - **Excerpt:** Below title; regular weight, black, smaller than title; can truncate with ellipsis.
    - **Metadata:** Bottom of text block; smaller, light gray. Format: `By [Author Name] — [Date]` (e.g. `By Oreoluwa Oyinlola — 07 Jul 2025`).
- **Spacing:** Comfortable vertical spacing between rows and between title / excerpt / metadata.
- **Optional:** Floating CTA (e.g. orange “Subscribe” button) bottom right — can be site-wide or notes-only.

---

### 2. When a single note is opened

- **Background:** White; no blue.
- **Layout:** Single column, content centered with a max-width and generous side margins for readability. No top nav in the reference; article content is the focus.
- **Order of blocks (top to bottom):**
  1. **Title** — Large, bold, dark grey/black, multi-line as needed.
  2. **Metadata block** — Author (with small circular grey avatar), then date and read time (e.g. `09 Feb 2026`, `3 min read`) in smaller, lighter grey.
  3. **Featured image** — Large rectangle below metadata. May be illustration or photo; can include text overlay (e.g. article title) for social preview.
  4. **Body** — Headings, paragraphs, lists, links (see “Text formatting” below).
- **Optional:** Floating CTA (e.g. orange “Subscribe”) on the right; stays visible on scroll.

---

### 3. How the text is formatted for each page

- **Font:** Clean sans-serif (e.g. Inter or similar); all black/dark grey on white.
- **Headings (e.g. Conclusion, section titles):**
  - Bold, sans-serif, noticeably larger than body.
  - Extra vertical space above and below to separate sections.
- **Body paragraphs:**
  - Regular weight, left-aligned.
  - Comfortable line height; one full blank line between paragraphs.
  - Margins so lines don’t run full viewport width.
- **Lists:**
  - Bulleted lists use a solid black disc.
  - Each item can have a **bold phrase** (e.g. “Revenue Explosion:”) followed by regular text.
  - Indentation and spacing between items for clarity.
- **Links:** Blue, underlined; clear hover state.
- **Emphasis:** Company names / proper nouns can use *italics*.
- **Hierarchy:** Title > headings > body > metadata; use size and weight, not color (aside from link blue).

---

### 4. How the featured image and other metadata are presented

- **List view:** Featured image = left-hand thumbnail; metadata = “By [Author] — [Date]” at bottom of text block, small and gray.
- **Single-note view:**
  - **Metadata** directly under the title: author (with small circular avatar), then date and read time in smaller, lighter grey.
  - **Featured image** immediately below metadata; full-width within content column, large rectangle. Can be custom artwork with title overlay for share preview.
- **Card view (related / READ MORE):** Image on top of card; metadata at bottom of card (same “By … — Date” format).

---

### 5. Related articles section

- **Section title:** e.g. “READ MORE” — uppercase, dark grey, top left of section.
- **Layout:** Horizontal grid of cards (e.g. 4 columns on large screens); equal-width cards, even spacing.
- **Per card:**
  - **Top:** Featured image (rectangular). Cards can optionally support “no image” (title first).
  - **Title:** Bold, dark grey, can wrap or truncate with ellipsis.
  - **Snippet:** Lighter grey, smaller, truncated with ellipsis.
  - **Metadata:** Bottom of card; small, light grey: `By [Author] — [Date]`.
- **Background:** White; consistent with notes list and single note.

Use this same card design for “Related articles” on a single note page and for any “READ MORE” or “More notes” list.

---

### 6. Metadetails and featured image for link sharing

- **Every note must have:**
  - **Featured image** — Required; used as the main image for the note in list, single, and card views.
  - **OG image** — The same featured image is used automatically as the Open Graph image when the note URL is shared (social, messaging, etc.).
- **Metadata to set automatically (or from note data):**
  - Author (display name)
  - Publication date (ISO and display format)
  - Read time (optional; can be computed from content length)
- **Implementation:** Ensure each note has a `featuredImage` URL; use it in `<meta property="og:image">` and `twitter:image` (and any other OG/Twitter meta) on the single-note page so the “set top” image is always what appears when the website link is shared.

---

## Homepage (white background)

- **Intent:** White background instead of blue; clean, minimal, modern.
- **Reference:** `screens/homepage-hero-nav.png`

**Checklist**

- [x] Homepage sample received
- [x] Spec written below
- [x] Implemented (white background, hero + tabbed main area, footer)

---

### Homepage layout and style

- **Background:** Primarily white. Optional: very subtle soft gradient in top-right — **not implemented**; can add later.
- **Hero section (top to bottom):**
  - **Logo:** Site logo (`/yawlogo.png`) top-left.
  - **Name:** Large, bold, dark grey, sans-serif; lowercase (“yaw antwi owusu”).
  - **Tagline:** “Operator, Designer & Entrepreneur” (muted).
  - **Bio:** Two short paragraphs with linked company names (Daakye Digital, Printmote, 233Founders) — **full detail** per latest copy, not only a single “Previously at” line.
- **Text formatting:** Sans-serif (Inter), hierarchy by size/weight/color; left-aligned.
- **Main area:** **Tabbed** — only one of Selected Work / Notes / About visible at a time (hash-driven; see Hero navigation). Footer with social links below.

---

## Hero navigation

- **Intent:** Navigation lives directly under the hero (no top nav bar on homepage). Same text formatting as rest of site.
- **Reference:** `screens/homepage-hero-nav.png`

**Checklist**

- [x] Hero nav sample received
- [x] Spec written below
- [x] Implemented

---

### Hero nav spec

- **Placement:** Horizontal bar immediately below the hero bio.
- **Labels:** **Experiences** | **Notes** | **& About** (three items).
- **Active state:** Current tab in a rounded pill: light grey background, white text.
- **Inactive state:** Plain muted text; no pill.
- **Homepage behaviour (implemented):** **Tabs**, not three stacked sections. URL hash is source of truth: `/#selected-work` (or empty) → Experiences; `/#notes` → Notes; `/#about` → About. Clicks use `window.location.hash` so `hashchange` updates content. Only one section renders at a time.
- **Redirects:** `/notes` and `/about` redirect to `/#notes` and `/#about`.
- **Single note page** (`/notes/[slug]`): **MinimalHeader** — logo + same three links; **Notes** pill active. No full hero on that page.
- **Social links:** In **footer** on the homepage (below tabbed content).

---

## Projects & experiences cards

Card-based section on the homepage for “selected work” (projects and experiences). Cards link out to external pages by default, or to internal project/experience pages when applicable.

**Reference screenshots:**

| Purpose | File |
|--------|------|
| Default state — grid of cards | `screens/projects-selected-work-cards.png` |
| Internal project page — metadata layout | `screens/project-detail-metadata.png` |
| Internal project page — preamble + hero with nav | `screens/project-detail-preamble-hero.png` |
| Section / hotspot reference | `screens/projects-section-reference.png` |

**Checklist**

- [x] Projects/experiences section — sample received
- [x] Internal project page format — samples received
- [x] Hover state — defined and implemented (see below)
- [x] Projects/experiences grid implemented in code
- [ ] Internal project **detail** routes (Option A / B layouts) — not built yet

---

### 1. When cards aren’t clicked (default state)

- **Section title:** “SELECTED WORK” — small uppercase, `text-neutral-500`, with **full-width horizontal rule** under the title (Brayden-style).
- **Section background:** `bg-neutral-50` (subtle contrast from white page).
- **Layout:** Responsive grid; **3 columns** from `lg` (`lg:grid-cols-3`), generous `gap-x` / `gap-y`.
- **Per card (default):** No card chrome — image (`rounded-2xl`) + title + metadata only. **Description hidden** until hover (see below).
- **Title:** Semibold, `text-neutral-900`.
- **Metadata:** `text-sm text-neutral-500`: `[Category] • [Year]`.
- **Images:** From `lib/projects.ts` (`image` URL); currently placeholder uses `/yawlogo.png` until real assets exist.

---

### 2. When cards are hovered over (implemented)

- **Lifted tray:** Inner wrapper gets **`#f2f2f2` background**, **`p-4`**, and **soft layered box-shadow** on hover/focus-within.
- **Title:** Transitions to **blue** (`text-blue-600`) on hover / keyboard focus-visible.
- **External links:** White circular **external-link icon** top-right on image; visible on hover and focus-within.
- **Description:** If present in data, shown **below** the grey tray (`line-clamp-2`, `text-neutral-400`) only on hover/focus-within.

---

### 3. Where cards lead (external vs internal)

- **Default:** Every card “always leads to another page” — either an external URL or an internal project/experience page.
- **External:** Open in new tab or same tab; no special layout, just the external site.
- **Internal:** When the destination is on your site, the target page should be formatted like the “additional screens” you provided:
  - **Option A — Metadata-focused layout:** Large project title, short description paragraph, then a two-column metadata block with labels (lighter grey) and values (black): **Client**, **Role**, **Timeline**, **Team** (names can be links), **Link**. A clear “Visit project” (or similar) link with external-icon (↗) when there is an external project URL. White background, centered content, good padding.
  - **Option B — Preamble + body + hero:** Small uppercase label (e.g. “PREAMBLE”) in accent (e.g. purple), then large title, then body paragraphs. Underlined/highlighted links in text. Optional large featured/hero image at bottom with rounded corners; that hero area can host a navigation overlay (e.g. “Horizon”, “Shop”, “Contact” + icons) for “navigation in the hero section” as in your other requirement.
- Use either Option A or B (or a single hybrid) per project type; the important part is that internal project/experience pages follow this text-and-metadata style, not the blue old layout.

---

## Design tokens (current)

- **CSS variables** ([app/globals.css](app/globals.css)): `--background: #ffffff`, `--foreground: #171717`, `--muted: #737373`, `--accent: #2563eb`.
- **Tailwind** ([tailwind.config.ts](tailwind.config.ts)): `background`, `foreground`, `muted`, `accent` map to those vars; sans = Inter (`--font-inter`).
- **Layout:** `.page-padding` = `px-6 md:px-12`; `.page-container` = **`max-w-7xl`** centered (widened from original `max-w-5xl`).
- **Colors in use:** White page; neutral-50 selected-work band; neutral greys for metadata; blue for links / project title hover; no global orange CTA unless added later.
- **Typography:** Prose for note body; consistent sans-serif sitewide.

## Doc vs code — known gaps (optional follow-ups)

- **Note list date format:** Spec examples use short dates (e.g. “07 Jul 2025”); app uses `toLocaleDateString("en-US", { month: "long", … })` — align if you want exact match.
- **Single-note reference:** Spec mentioned optional floating “Subscribe” CTA — not implemented.
- **Internal project pages:** Option A/B layouts documented; **no** `/work/[slug]` (or similar) pages yet.
- **Category badge on single note:** Present in `NoteTemplate`; early reference sometimes omitted it — keep or remove per taste.
