export type NoteCategory = 
  | "Podcasting"
  | "Music"
  | "Personal Life"
  | "Personal Notes"
  | "Career"
  | "Thoughts"
  | "Product Musings"
  | "Entrepreneurship in Ghana";

export interface Note {
  slug: string;
  title: string;
  category: NoteCategory;
  datePublished: string; // ISO date string
  featuredImage: string; // URL or path to image
  content: string; // Markdown or HTML content
  excerpt?: string; // Optional excerpt for previews
  author?: string; // Display name; defaults to site author in UI
}

/** List/grid views: omit `content` so client bundles stay small. */
export type NoteListItem = Omit<Note, "content">;

