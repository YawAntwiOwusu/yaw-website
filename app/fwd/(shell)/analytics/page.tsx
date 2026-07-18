import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/fwd/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      <p className="mt-1 text-slate-600">
        First-party pageviews across products.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
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
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      )}

      {summary && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Pageviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {summary.totals.pageviews}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{summary.totals.sessions}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Top paths</h2>
              <ul className="mt-3 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                {summary.topPaths.map((row) => (
                  <li
                    key={row.path}
                    className="flex justify-between gap-4 px-4 py-2 text-sm"
                  >
                    <span className="truncate text-slate-700">{row.path}</span>
                    <span className="font-medium text-slate-900">
                      {row.count}
                    </span>
                  </li>
                ))}
                {summary.topPaths.length === 0 && (
                  <li className="px-4 py-6 text-sm text-slate-500">
                    No pageviews yet.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">By day</h2>
              <ul className="mt-3 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                {summary.byDay.map((row) => (
                  <li
                    key={row.day}
                    className="flex justify-between gap-4 px-4 py-2 text-sm"
                  >
                    <span className="text-slate-700">{row.day}</span>
                    <span className="font-medium text-slate-900">
                      {row.count}
                    </span>
                  </li>
                ))}
                {summary.byDay.length === 0 && (
                  <li className="px-4 py-6 text-sm text-slate-500">
                    No daily data yet.
                  </li>
                )}
              </ul>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">
                By product
              </h2>
              <ul className="mt-3 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                {summary.byProduct.map((row) => (
                  <li
                    key={row.productSlug ?? "unknown"}
                    className="flex justify-between gap-4 px-4 py-2 text-sm"
                  >
                    <span className="text-slate-700">
                      {row.productSlug || "unknown"}
                    </span>
                    <span className="font-medium text-slate-900">
                      {row.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
