import { Suspense } from "react";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { requireDb, applications } from "@/lib/firstdomain/db";
import { ApplicationsTable } from "@/components/firstdomain/admin/ApplicationsTable";

export const metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    country?: string;
    category?: string;
    launchStage?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function AdminApplicationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const db = requireDb();

  const conditions = [];

  if (params.status && params.status !== "all") {
    conditions.push(
      eq(
        applications.status,
        params.status as typeof applications.status.enumValues[number]
      )
    );
  }
  if (params.country && params.country !== "all") {
    conditions.push(eq(applications.country, params.country));
  }
  if (params.category && params.category !== "all") {
    conditions.push(eq(applications.category, params.category));
  }
  if (params.launchStage && params.launchStage !== "all") {
    conditions.push(eq(applications.launchStage, params.launchStage));
  }
  if (params.search) {
    conditions.push(
      or(
        ilike(applications.fullName, `%${params.search}%`),
        ilike(applications.projectName, `%${params.search}%`),
        ilike(applications.email, `%${params.search}%`)
      )
    );
  }

  const allApps = await db
    .select()
    .from(applications)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(applications.createdAt));

  const countries = [...new Set(allApps.map((a) => a.country))].sort();
  const categories = [...new Set(allApps.map((a) => a.category))].sort();
  const launchStages = [...new Set(allApps.map((a) => a.launchStage))].sort();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
      <p className="mt-1 text-slate-600">
        {allApps.length} application{allApps.length !== 1 ? "s" : ""}
      </p>
      <div className="mt-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ApplicationsTable
            applications={allApps}
            filters={params}
            countries={countries}
            categories={categories}
            launchStages={launchStages}
          />
        </Suspense>
      </div>
    </div>
  );
}
