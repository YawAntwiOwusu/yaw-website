import { desc, eq } from "drizzle-orm";
import {
  requireDb,
  domainRegistrations,
  applications,
} from "@/lib/firstdomain/db";
import { DomainQueue } from "@/components/firstdomain/admin/DomainQueue";

export const metadata = { title: "Domain Management" };
export const dynamic = "force-dynamic";

export default async function AdminDomainsPage() {
  const db = requireDb();

  const registrations = await db
    .select({
      registration: domainRegistrations,
      application: {
        fullName: applications.fullName,
        projectName: applications.projectName,
        email: applications.email,
      },
    })
    .from(domainRegistrations)
    .innerJoin(
      applications,
      eq(domainRegistrations.applicationId, applications.id)
    )
    .orderBy(desc(domainRegistrations.createdAt));

  const items = registrations.map((r) => ({
    ...r.registration,
    application: r.application,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Domain Management</h1>
      <p className="mt-1 text-slate-600">
        Register domains for winners via Namecheap API
      </p>
      <div className="mt-6">
        <DomainQueue registrations={items} />
      </div>
    </div>
  );
}
