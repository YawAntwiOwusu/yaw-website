"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/db";
import { createPost, updatePost, deletePost } from "@/lib/fwd/actions/site-content";
import { TipTapEditor } from "@/components/fwd/TipTapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "Podcasting",
  "Music",
  "Personal Life",
  "Personal Notes",
  "Career",
  "Thoughts",
  "Product Musings",
  "Entrepreneurship in Ghana",
];

export function PostEditorForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [category, setCategory] = useState(post?.category ?? CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    post?.featuredImageUrl ?? ""
  );
  const [author, setAuthor] = useState(post?.author ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    post?.status ?? "draft"
  );
  const [publishedAt, setPublishedAt] = useState(() => {
    if (!post?.publishedAt) return new Date().toISOString().slice(0, 10);
    const value =
      typeof post.publishedAt === "string"
        ? post.publishedAt
        : post.publishedAt.toISOString();
    return value.slice(0, 10);
  });
  const [content, setContent] = useState(post?.content ?? "");

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          title,
          slug,
          category,
          excerpt,
          featuredImageUrl,
          author,
          status,
          publishedAt: status === "published" ? publishedAt : null,
          content,
        };
        if (post) {
          await updatePost(post.id, payload);
          router.refresh();
        } else {
          const created = await createPost(payload);
          router.push(`/fwd/products/site/blog/${created.id}`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  function remove() {
    if (!post) return;
    if (!window.confirm("Delete this post?")) return;
    startTransition(async () => {
      await deletePost(post.id);
      router.push("/fwd/products/site/blog");
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from title if empty"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <Label htmlFor="publishedAt">Publish date</Label>
          <Input
            id="publishedAt"
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Yaw Antwi-Owusu"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="featuredImageUrl">Featured image URL</Label>
        <Input
          id="featuredImageUrl"
          value={featuredImageUrl}
          onChange={(e) => setFeaturedImageUrl(e.target.value)}
          placeholder="/images/... or Blob URL"
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>Content</Label>
        <div className="mt-2">
          <TipTapEditor value={content} onChange={setContent} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={save} disabled={pending || !title}>
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
        {post && (
          <Button
            type="button"
            variant="outline"
            onClick={remove}
            disabled={pending}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
