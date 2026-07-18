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
    datePublished: (post.publishedAt ?? post.createdAt)
      .toISOString()
      .slice(0, 10),
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

/** True when Neon is configured — public reads must come from DB. */
function hasDatabase() {
  return Boolean(db);
}

export async function listPublishedNotes(): Promise<Note[]> {
  // No DATABASE_URL: local/static pipeline source only.
  if (!hasDatabase()) return getStaticNotes();

  const rows = await db!
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));
  return rows.map(postToNote);
}

export async function listPublishedNoteItems(): Promise<NoteListItem[]> {
  const notes = await listPublishedNotes();
  return notes.map(({ content: _content, ...rest }) => rest);
}

export async function getPublishedNoteBySlug(
  slug: string
): Promise<Note | undefined> {
  if (!hasDatabase()) return getStaticNoteBySlug(slug);

  const [row] = await db!
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  return row ? postToNote(row) : undefined;
}

export async function listPublishedProjects(): Promise<Project[]> {
  if (!hasDatabase()) return getStaticProjects();

  const rows = await db!
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  return rows.map(projectRowToProject);
}

export { postToNote, projectRowToProject };
