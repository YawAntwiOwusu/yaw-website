import Link from "next/link";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";
import { ActivityChart } from "@/components/fwd/ActivityChart";
import { Button } from "@/components/ui/button";
import { getSiteProductStats } from "@/lib/fwd/actions/site-content";
import { getAnalyticsSummary } from "@/lib/fwd/actions/analytics";

export const metadata = { title: "Dashboard — FWD" };
export const dynamic = "force-dynamic";

export default async function FwdDashboardPage() {
  let stats = {
    posts: { total: 0, published: 0, drafts: 0 },
    projects: { total: 0, published: 0 },
    comments: { pending: 0, approved: 0 },
  };
  let pageviews = 0;
  let byDay: { day: string; count: number }[] = [];
  let error: string | null = null;

  try {
    stats = await getSiteProductStats();
    const analytics = await getAnalyticsSummary({ days: 30, productSlug: "all" });
    pageviews = analytics.totals.pageviews;
    byDay = analytics.byDay;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load dashboard";
  }

  const cards = [
    {
      label: "Posts",
      value: stats.posts.total,
      hint: `${stats.posts.published} published · ${stats.posts.drafts} drafts`,
    },
    {
      label: "Pending",
      value: stats.comments.pending,
      hint: `${stats.comments.approved} approved comments`,
    },
    {
      label: "Projects",
      value: stats.projects.total,
      hint: `${stats.projects.published} published`,
    },
    {
      label: "Pageviews",
      value: pageviews,
      hint: "Last 30 days",
    },
  ];

  return (
    <div>
      <FwdPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Site content and traffic at a glance."
        actions={
          <>
            <Button asChild>
              <Link href="/fwd/blog/new">New post</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/fwd/products/firstdomain">First Domain</Link>
            </Button>
          </>
        }
      />

      {error && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}. Set DATABASE_URL and run{" "}
          <code className="font-mono text-xs">npm run db:bootstrap:site</code>.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ActivityChart days={30} points={byDay} />
      </div>
    </div>
  );
}
