import Link from "next/link";
import { getSiteProductStats } from "@/lib/fwd/actions/site-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Site — FWD" };
export const dynamic = "force-dynamic";

export default async function SiteProductHomePage() {
  let stats = {
    posts: { total: 0, published: 0, drafts: 0 },
    projects: { total: 0, published: 0 },
    comments: { pending: 0, approved: 0 },
  };

  try {
    stats = await getSiteProductStats();
  } catch {
    // DB may be unconfigured in local/dev
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Site</h1>
      <p className="mt-1 text-slate-600">
        Blog, projects, and comment moderation for the public site.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.posts.total}</p>
            <p className="text-sm text-slate-500">
              {stats.posts.published} published · {stats.posts.drafts} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.projects.total}</p>
            <p className="text-sm text-slate-500">
              {stats.projects.published} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.comments.pending}</p>
            <p className="text-sm text-slate-500">
              pending · {stats.comments.approved} approved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/fwd/products/site/blog">Manage blog</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/fwd/products/site/projects">Manage projects</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/fwd/products/site/comments">Moderate comments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/fwd/media">Media library</Link>
        </Button>
      </div>
    </div>
  );
}
