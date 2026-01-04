# Notes Template Guide

This guide explains how to use the Notes template system for creating blog posts/articles.

## Overview

The Notes system provides a complete template for blog posts with all required features:
1. **Title** - The main heading of the note
2. **Category** - One of: Podcasting, Music, Personal Life, Personal Notes, Career
3. **Date Published** - ISO date string (YYYY-MM-DD)
4. **URL** - Automatically generated as `domain.com/notes/[slug]`
5. **Body Content** - HTML content of the article
6. **Featured Image** - Image URL/path for social sharing (Open Graph)

## Adding a New Note

### Step 1: Add Note Data

Edit `lib/notes.ts` and add your note to the `notes` array:

```typescript
{
  slug: "my-first-note", // URL-friendly identifier
  title: "My First Note",
  category: "Personal Notes", // Must be one of the defined categories
  datePublished: "2024-01-15", // ISO date format (YYYY-MM-DD)
  featuredImage: "/images/notes/my-featured-image.jpg", // Path to image
  content: "<p>Your HTML content here...</p>", // HTML content
  excerpt: "A brief excerpt for previews and SEO", // Optional
}
```

### Step 2: Add Featured Image

Place your featured image in the `public/images/notes/` directory (create if needed):
- Recommended size: 1200x630px (for optimal social sharing)
- Format: JPG, PNG, or WebP
- Reference it in the `featuredImage` field (e.g., `/images/notes/my-image.jpg`)

### Step 3: Write Content

The `content` field accepts HTML. You can write:
- Paragraphs: `<p>Text here</p>`
- Headings: `<h2>Heading</h2>`, `<h3>Subheading</h3>`, etc.
- Links: `<a href="url">Link text</a>`
- Bold: `<strong>Bold text</strong>`
- Lists: `<ul><li>Item</li></ul>` or `<ol><li>Item</li></ol>`
- Code: `<code>code</code>` or `<pre><code>code block</code></pre>`
- Blockquotes: `<blockquote>Quote</blockquote>`

## Available Categories

- `"Podcasting"`
- `"Music"`
- `"Personal Life"`
- `"Personal Notes"`
- `"Career"`

## URL Structure

Notes are automatically accessible at:
```
https://yourdomain.com/notes/[slug]
```

The `slug` is the URL-friendly identifier you define in the note data.

## Example Note

```typescript
{
  slug: "building-my-first-product",
  title: "Building My First Product",
  category: "Career",
  datePublished: "2024-01-20",
  featuredImage: "/images/notes/product-launch.jpg",
  content: `
    <h2>Introduction</h2>
    <p>This is the story of how I built my first product...</p>
    <h2>The Process</h2>
    <p>Here's what I learned along the way...</p>
    <ul>
      <li>First lesson</li>
      <li>Second lesson</li>
      <li>Third lesson</li>
    </ul>
    <h2>Conclusion</h2>
    <p>In summary, building a product was an amazing experience...</p>
  `,
  excerpt: "Lessons learned from building and launching my first product in 2024.",
}
```

## SEO & Social Sharing

The template automatically includes:
- **Open Graph tags** for Facebook, LinkedIn, etc.
- **Twitter Card** tags
- **Canonical URL**
- **Meta descriptions** (uses excerpt if available)

The featured image is used for social media previews when sharing links.

## Customization

### Changing the Site URL

Set the `NEXT_PUBLIC_SITE_URL` environment variable in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Styling

The note template uses Tailwind CSS classes. You can customize the styling in:
- `components/NoteTemplate.tsx` - Main template component
- `app/globals.css` - Global styles (prose classes for content)

## Helper Functions

The `lib/notes.ts` file provides helper functions:

- `getNoteBySlug(slug: string)` - Get a single note by slug
- `getAllNotes()` - Get all notes (sorted by date, newest first)
- `getNotesByCategory(category: NoteCategory)` - Get notes by category
- `formatDate(dateString: string)` - Format ISO date to readable format

## Future Enhancements

You can extend this system by:
- Adding Markdown support (using a library like `react-markdown`)
- Connecting to a CMS or database
- Adding search functionality
- Adding category filtering on the Notes index page
- Adding pagination
- Adding reading time estimates

