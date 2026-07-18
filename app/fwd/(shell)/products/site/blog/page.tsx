import Link from "next/link";
import { listAdminPosts } from "@/lib/fwd/actions/site-content";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Blog — Site — FWD" };
export const dynamic = "force-dynamic";

export default async function SiteBlogListPage() {
  let posts: Awaited<ReturnType<typeof listAdminPosts>> = [];
  let error: string | null = null;
  try {
    posts = await listAdminPosts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load posts";
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
          <p className="mt-1 text-slate-600">
            Create and publish notes for the public site.
          </p>
        </div>
        <Button asChild>
          <Link href="/fwd/products/site/blog/new">New post</Link>
        </Button>
      </div>

      {error && (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}. Configure DATABASE_URL and run migrations + `npm run db:seed:site`.
        </p>
      )}

      <ul className="mt-6 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <Link
                href={`/fwd/products/site/blog/${post.id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-slate-500">
                /{post.slug} · {post.category} · {post.status}
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/fwd/products/site/blog/${post.id}`}>Edit</Link>
            </Button>
          </li>
        ))}
        {!error && posts.length === 0 && (
          <li className="px-4 py-6 text-sm text-slate-500">
            No posts yet. Create one or seed from existing notes.
          </li>
        )}
      </ul>
    </div>
  );
}
