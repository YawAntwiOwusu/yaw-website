export type NoteCategory = 
  | "Podcasting"
  | "Music"
  | "Personal Life"
  | "Personal Notes"
  | "Career";

export interface Note {
  slug: string;
  title: string;
  category: NoteCategory;
  datePublished: string; // ISO date string
  featuredImage: string; // URL or path to image
  content: string; // Markdown or HTML content
  excerpt?: string; // Optional excerpt for previews
}

