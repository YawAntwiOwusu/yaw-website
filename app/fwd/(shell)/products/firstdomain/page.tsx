import { eq, desc, sql } from "drizzle-orm";
import Link from "next/link";
import {
  requireDb,
  applications,
  applicationCycles,
  domainRegistrations,
  founders,
} from "@/lib/firstdomain/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CycleControls } from "@/components/firstdomain/admin/CycleControls";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";

export const metadata = { title: "First Domain — FWD" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = requireDb();

  const [currentCycle] = await db
    .select()
    .from(applicationCycles)
    .orderBy(desc(applicationCycles.createdAt))
    .limit(1);

  const [appStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      new: sql<number>`count(*) filter (where ${applications.status} = 'new')::int`,
      underReview: sql<number>`count(*) filter (where ${applications.status} = 'under_review')::int`,
      shortlisted: sql<number>`count(*) filter (where ${applications.status} = 'shortlisted')::int`,
      winners: sql<number>`count(*) filter (where ${applications.status} = 'winner')::int`,
    })
    .from(applications);

  const [founderCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(founders);

  const pendingDomains = await db
    .select()
    .from(domainRegistrations)
    .where(eq(domainRegistrations.status, "pending"));

  return (
    <div>
      <FwdPageHeader
        eyebrow="Products"
        title="First Domain"
        description="Program overview and monthly workflow."
        actions={
          <>
            <Button asChild>
              <Link href="/fwd/products/firstdomain/applications">
                Applications
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/fwd/products/firstdomain/domains">Domain queue</Link>
            </Button>
          </>
        }
      />

      {currentCycle && (
        <div className="mt-8">
          <CycleControls cycle={currentCycle} />
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{appStats?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{appStats?.underReview ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Founders in CRM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{founderCount?.count ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingDomains.length}</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
