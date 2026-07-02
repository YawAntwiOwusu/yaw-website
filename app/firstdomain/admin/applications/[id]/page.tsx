import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb, applications } from "@/lib/firstdomain/db";
import { ReviewWorkspace } from "@/components/firstdomain/admin/ReviewWorkspace";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = requireDb();
  const [app] = await db
    .select({ projectName: applications.projectName })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  return { title: app ? `Review: ${app.projectName}` : "Review" };
}

export default async function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = requireDb();

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!application) notFound();

  return (
    <div>
      <Link
        href="/firstdomain/admin/applications"
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Back to Applications
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        {application.projectName}
      </h1>
      <p className="text-slate-600">{application.fullName}</p>
      <div className="mt-8">
        <ReviewWorkspace application={application} />
      </div>
    </div>
  );
}
