"use server";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { analyticsEvents, requireDb, db } from "@/lib/db";
import { requireAdmin } from "@/lib/fwd/auth/admin";
import { productSlugFromPath, type ProductSlug } from "@/lib/fwd/products";

export async function recordPageview(data: {
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
}) {
  if (!db) return { ok: false as const };
  const path = data.path.split("?")[0] || "/";
  if (path.startsWith("/fwd") || path.startsWith("/api")) {
    return { ok: false as const };
  }

  await db.insert(analyticsEvents).values({
    type: "pageview",
    path,
    referrer: data.referrer || null,
    userAgent: data.userAgent || null,
    sessionId: data.sessionId || null,
    productSlug: productSlugFromPath(path),
  });

  return { ok: true as const };
}

export async function getAnalyticsSummary(options?: {
  days?: number;
  productSlug?: ProductSlug | "all";
}) {
  await requireAdmin();
  const database = requireDb();
  const days = options?.days ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const productSlug = options?.productSlug ?? "all";

  const conditions = [gte(analyticsEvents.createdAt, since)];
  if (productSlug !== "all") {
    conditions.push(eq(analyticsEvents.productSlug, productSlug));
  }

  const where = and(...conditions);

  const [totals] = await database
    .select({
      pageviews: sql<number>`count(*)::int`,
      sessions: sql<number>`count(distinct ${analyticsEvents.sessionId})::int`,
    })
    .from(analyticsEvents)
    .where(where);

  const topPaths = await database
    .select({
      path: analyticsEvents.path,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEvents)
    .where(where)
    .groupBy(analyticsEvents.path)
    .orderBy(desc(sql`count(*)`))
    .limit(15);

  const byDay = await database
    .select({
      day: sql<string>`to_char(date_trunc('day', ${analyticsEvents.createdAt}), 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEvents)
    .where(where)
    .groupBy(sql`date_trunc('day', ${analyticsEvents.createdAt})`)
    .orderBy(sql`date_trunc('day', ${analyticsEvents.createdAt})`);

  const byProduct = await database
    .select({
      productSlug: analyticsEvents.productSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, since))
    .groupBy(analyticsEvents.productSlug)
    .orderBy(desc(sql`count(*)`));

  return {
    days,
    totals: totals ?? { pageviews: 0, sessions: 0 },
    topPaths,
    byDay,
    byProduct,
  };
}
