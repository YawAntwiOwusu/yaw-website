import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/fwd/actions/analytics";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";
import { ActivityChart } from "@/components/fwd/ActivityChart";
import { Button } from "@/components/ui/button";
import type { ProductSlug } from "@/lib/fwd/products";

export const metadata = { title: "Analytics — FWD" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; product?: string }>;
}) {
  const params = await searchParams;
  const days = params.days === "7" ? 7 : 30;
  const product =
    params.product === "site" || params.product === "firstdomain"
      ? (params.product as ProductSlug)
      : "all";

  let summary: Awaited<ReturnType<typeof getAnalyticsSummary>> | null = null;
  let error: string | null = null;
  try {
    summary = await getAnalyticsSummary({ days, productSlug: product });
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load analytics";
  }

  return (
    <div>
      <FwdPageHeader
        eyebrow="Manage"
        title="Analytics"
        description="First-party pageviews across the site and products."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild size="sm" variant={days === 7 ? "default" : "outline"}>
          <Link href={`/fwd/analytics?days=7&product=${product}`}>7 days</Link>
        </Button>
        <Button asChild size="sm" variant={days === 30 ? "default" : "outline"}>
          <Link href={`/fwd/analytics?days=30&product=${product}`}>30 days</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={product === "all" ? "default" : "outline"}
        >
          <Link href={`/fwd/analytics?days=${days}&product=all`}>All</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={product === "site" ? "default" : "outline"}
        >
          <Link href={`/fwd/analytics?days=${days}&product=site`}>Site</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={product === "firstdomain" ? "default" : "outline"}
        >
          <Link href={`/fwd/analytics?days=${days}&product=firstdomain`}>
            First Domain
          </Link>
        </Button>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Pageviews
              </p>
              <p className="mt-2 text-3xl font-semibold text-neutral-950">
                {summary.totals.pageviews}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Sessions
              </p>
              <p className="mt-2 text-3xl font-semibold text-neutral-950">
                {summary.totals.sessions}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ActivityChart days={days} points={summary.byDay} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Top paths</h2>
              <ul className="mt-3 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                {summary.topPaths.map((row) => (
                  <li
                    key={row.path}
                    className="flex justify-between gap-4 px-4 py-2 text-sm"
                  >
                    <span className="truncate text-neutral-700">{row.path}</span>
                    <span className="font-medium text-neutral-900">
                      {row.count}
                    </span>
                  </li>
                ))}
                {summary.topPaths.length === 0 && (
                  <li className="px-4 py-6 text-sm text-neutral-500">
                    No pageviews yet.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                By product
              </h2>
              <ul className="mt-3 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                {summary.byProduct.map((row) => (
                  <li
                    key={row.productSlug ?? "unknown"}
                    className="flex justify-between gap-4 px-4 py-2 text-sm"
                  >
                    <span className="text-neutral-700">
                      {row.productSlug || "unknown"}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {row.count}
                    </span>
                  </li>
                ))}
                {summary.byProduct.length === 0 && (
                  <li className="px-4 py-6 text-sm text-neutral-500">
                    No product breakdown yet.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
