"use server";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import {
  requireDb,
  posts,
  projects,
  mediaAssets,
  comments,
  type Post,
  type ProjectRow,
  type MediaAsset,
  type Comment,
} from "@/lib/db";
import { requireAdmin } from "@/lib/fwd/auth/admin";
import { slugify } from "@/lib/utils";

function revalidateSite() {
  revalidatePath("/notes");
  revalidatePath("/");
  revalidatePath("/fwd/products/site");
  revalidatePath("/fwd/products/site/blog");
  revalidatePath("/fwd/products/site/projects");
  revalidatePath("/fwd/products/site/comments");
  revalidatePath("/fwd/media");
}

export async function listAdminPosts(): Promise<Post[]> {
  await requireAdmin();
  const db = requireDb();
  return db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function getAdminPost(id: string): Promise<Post | null> {
  await requireAdmin();
  const db = requireDb();
  const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return row ?? null;
}

export async function createPost(data: {
  title: string;
  slug?: string;
  category: string;
  excerpt?: string;
  content?: string;
  featuredImageUrl?: string;
  author?: string;
  status: "draft" | "published";
  publishedAt?: string | null;
}) {
  await requireAdmin();
  const db = requireDb();
  const slug = (data.slug?.trim() || slugify(data.title)).toLowerCase();
  const publishedAt =
    data.status === "published"
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

  const [row] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      category: data.category,
      excerpt: data.excerpt || null,
      content: data.content || "",
      featuredImageUrl: data.featuredImageUrl || "",
      author: data.author || null,
      status: data.status,
      publishedAt,
    })
    .returning();

  revalidateSite();
  revalidatePath(`/${slug}`);
  return row;
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    slug: string;
    category: string;
    excerpt?: string;
    content?: string;
    featuredImageUrl?: string;
    author?: string;
    status: "draft" | "published";
    publishedAt?: string | null;
  }
) {
  await requireAdmin();
  const db = requireDb();
  const slug = data.slug.trim().toLowerCase();
  const publishedAt =
    data.status === "published"
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

  const [row] = await db
    .update(posts)
    .set({
      title: data.title,
      slug,
      category: data.category,
      excerpt: data.excerpt || null,
      content: data.content || "",
      featuredImageUrl: data.featuredImageUrl || "",
      author: data.author || null,
      status: data.status,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();

  revalidateSite();
  revalidatePath(`/${slug}`);
  return row;
}

export async function deletePost(id: string) {
  await requireAdmin();
  const db = requireDb();
  const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  await db.delete(posts).where(eq(posts.id, id));
  revalidateSite();
  if (row) revalidatePath(`/${row.slug}`);
  return { success: true };
}

export async function listAdminProjects(): Promise<ProjectRow[]> {
  await requireAdmin();
  const db = requireDb();
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function upsertProject(data: {
  id?: string;
  title: string;
  slug?: string;
  category: string;
  year: string;
  description?: string;
  image: string;
  href: string;
  internal?: boolean;
  sortOrder?: number;
  published?: boolean;
}) {
  await requireAdmin();
  const db = requireDb();
  const slug = (data.slug?.trim() || slugify(data.title)).toLowerCase();
  const values = {
    title: data.title,
    slug,
    category: data.category,
    year: data.year,
    description: data.description || null,
    image: data.image,
    href: data.href,
    internal: data.internal ?? false,
    sortOrder: data.sortOrder ?? 0,
    published: data.published ?? true,
    updatedAt: new Date(),
  };

  let row: ProjectRow;
  if (data.id) {
    [row] = await db
      .update(projects)
      .set(values)
      .where(eq(projects.id, data.id))
      .returning();
  } else {
    [row] = await db.insert(projects).values(values).returning();
  }

  revalidateSite();
  return row;
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const db = requireDb();
  await db.delete(projects).where(eq(projects.id, id));
  revalidateSite();
  return { success: true };
}

export async function listMediaAssets(
  productSlug?: string | null
): Promise<MediaAsset[]> {
  await requireAdmin();
  const db = requireDb();
  if (productSlug) {
    return db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.productSlug, productSlug))
      .orderBy(desc(mediaAssets.createdAt));
  }
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function uploadMediaAsset(formData: FormData) {
  await requireAdmin();
  const db = requireDb();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("File is required");
  }
  const productSlug = String(formData.get("productSlug") || "") || null;
  const alt = String(formData.get("alt") || "") || null;

  const blob = await put(`fwd/${Date.now()}-${file.name}`, file, {
    access: "public",
    contentType: file.type || undefined,
  });

  const [row] = await db
    .insert(mediaAssets)
    .values({
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
      mimeType: file.type || null,
      size: file.size,
      alt,
      productSlug,
    })
    .returning();

  revalidatePath("/fwd/media");
  return row;
}

export async function deleteMediaAsset(id: string) {
  await requireAdmin();
  const db = requireDb();
  const [row] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!row) return { success: false };

  try {
    await del(row.url);
  } catch {
    // Blob may already be gone; still remove DB row
  }
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  revalidatePath("/fwd/media");
  return { success: true };
}

export async function listAdminComments(status?: Comment["status"]) {
  await requireAdmin();
  const db = requireDb();
  const rows = await db
    .select({
      comment: comments,
      postTitle: posts.title,
      postSlug: posts.slug,
    })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .where(status ? eq(comments.status, status) : undefined)
    .orderBy(desc(comments.createdAt));
  return rows;
}

export async function moderateComment(
  id: string,
  status: Comment["status"]
) {
  await requireAdmin();
  const db = requireDb();
  await db.update(comments).set({ status }).where(eq(comments.id, id));
  revalidatePath("/fwd/products/site/comments");
  return { success: true };
}

export async function deleteComment(id: string) {
  await requireAdmin();
  const db = requireDb();
  await db.delete(comments).where(eq(comments.id, id));
  revalidatePath("/fwd/products/site/comments");
  return { success: true };
}

export async function getSiteProductStats() {
  await requireAdmin();
  const db = requireDb();
  const [postStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${posts.status} = 'published')::int`,
      drafts: sql<number>`count(*) filter (where ${posts.status} = 'draft')::int`,
    })
    .from(posts);
  const [projectStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${projects.published} = true)::int`,
    })
    .from(projects);
  const [commentStats] = await db
    .select({
      pending: sql<number>`count(*) filter (where ${comments.status} = 'pending')::int`,
      approved: sql<number>`count(*) filter (where ${comments.status} = 'approved')::int`,
    })
    .from(comments);

  return {
    posts: postStats ?? { total: 0, published: 0, drafts: 0 },
    projects: projectStats ?? { total: 0, published: 0 },
    comments: commentStats ?? { pending: 0, approved: 0 },
  };
}

export async function submitPublicComment(data: {
  postSlug: string;
  authorName: string;
  authorEmail: string;
  body: string;
}) {
  try {
    const db = requireDb();
    const name = data.authorName.trim();
    const email = data.authorEmail.trim();
    const body = data.body.trim();
    if (!name || !email || !body) {
      return { error: "Name, email, and comment are required" };
    }
    if (body.length > 5000) {
      return { error: "Comment is too long" };
    }

    const [post] = await db
      .select({ id: posts.id, slug: posts.slug })
      .from(posts)
      .where(and(eq(posts.slug, data.postSlug), eq(posts.status, "published")))
      .limit(1);

    if (!post) {
      return { error: "Post not found" };
    }

    await db.insert(comments).values({
      postId: post.id,
      authorName: name,
      authorEmail: email,
      body,
      status: "pending",
    });

    revalidatePath(`/${post.slug}`);
    return { success: true as const };
  } catch {
    return { error: "Comments are unavailable right now" };
  }
}

export async function listApprovedCommentsForSlug(slug: string) {
  try {
    const { db: database } = await import("@/lib/db");
    if (!database) return [];
    const [post] = await database
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);
    if (!post) return [];
    return database
      .select()
      .from(comments)
      .where(
        and(eq(comments.postId, post.id), eq(comments.status, "approved"))
      )
      .orderBy(asc(comments.createdAt));
  } catch {
    return [];
  }
}
