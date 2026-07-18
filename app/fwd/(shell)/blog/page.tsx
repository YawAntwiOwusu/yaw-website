import Link from "next/link";
import { listAdminPosts } from "@/lib/fwd/actions/site-content";
import { Button } from "@/components/ui/button";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";

export const metadata = { title: "Blog — FWD" };
export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  let posts: Awaited<ReturnType<typeof listAdminPosts>> = [];
  let error: string | null = null;
  try {
    posts = await listAdminPosts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load posts";
  }

  return (
    <div>
      <FwdPageHeader
        eyebrow="Manage"
        title="Blog"
        description="Create and publish notes for the public site."
        actions={
          <Button asChild>
            <Link href="/fwd/blog/new">New post</Link>
          </Button>
        }
      />

      {error && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}. Run <code className="font-mono text-xs">npm run db:bootstrap:site</code>.
        </p>
      )}

      <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div>
              <Link
                href={`/fwd/blog/${post.id}`}
                className="font-medium text-neutral-900 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-neutral-500">
                /{post.slug} · {post.category} · {post.status}
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/fwd/blog/${post.id}`}>Edit</Link>
            </Button>
          </li>
        ))}
        {!error && posts.length === 0 && (
          <li className="px-4 py-8 text-sm text-neutral-500">
            No posts yet. Create one or run the content pipeline.
          </li>
        )}
      </ul>
    </div>
  );
}
