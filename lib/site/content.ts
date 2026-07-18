import { and, asc, desc, eq } from "drizzle-orm";
import { db, posts, projects, type Post, type ProjectRow } from "@/lib/db";
import {
  getAllNotes as getStaticNotes,
  getNoteBySlug as getStaticNoteBySlug,
} from "@/lib/notes";
import { getAllProjects as getStaticProjects } from "@/lib/projects";
import type { Note, NoteCategory, NoteListItem } from "@/types/note";
import type { Project } from "@/types/project";

function postToNote(post: Post): Note {
  return {
    slug: post.slug,
    title: post.title,
    category: post.category as NoteCategory,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10),
    featuredImage: post.featuredImageUrl,
    content: post.content,
    excerpt: post.excerpt ?? undefined,
    author: post.author ?? undefined,
  };
}

function projectRowToProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category as Project["category"],
    year: row.year,
    description: row.description ?? undefined,
    image: row.image,
    href: row.href,
    internal: row.internal,
  };
}

export async function listPublishedNotes(): Promise<Note[]> {
  if (!db) return getStaticNotes();
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
    if (rows.length === 0) return getStaticNotes();
    return rows.map(postToNote);
  } catch {
    return getStaticNotes();
  }
}

export async function listPublishedNoteItems(): Promise<NoteListItem[]> {
  const notes = await listPublishedNotes();
  return notes.map(({ content: _content, ...rest }) => rest);
}

export async function getPublishedNoteBySlug(
  slug: string
): Promise<Note | undefined> {
  if (!db) return getStaticNoteBySlug(slug);
  try {
    const [row] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
      .limit(1);
    if (!row) {
      // Fall back only when table appears empty / unseeded
      const anyPost = await db.select({ id: posts.id }).from(posts).limit(1);
      if (anyPost.length === 0) return getStaticNoteBySlug(slug);
      return undefined;
    }
    return postToNote(row);
  } catch {
    return getStaticNoteBySlug(slug);
  }
}

export async function listPublishedProjects(): Promise<Project[]> {
  if (!db) return getStaticProjects();
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
    if (rows.length === 0) return getStaticProjects();
    return rows.map(projectRowToProject);
  } catch {
    return getStaticProjects();
  }
}

export { postToNote, projectRowToProject };
