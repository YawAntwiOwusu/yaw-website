import { desc } from "drizzle-orm";
import { requireDb, founders } from "@/lib/firstdomain/db";
import { FoundersTable } from "@/components/firstdomain/admin/FoundersTable";

export const metadata = { title: "Founder CRM" };
export const dynamic = "force-dynamic";

export default async function AdminFoundersPage() {
  const db = requireDb();
  const allFounders = await db
    .select()
    .from(founders)
    .orderBy(desc(founders.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Founder CRM</h1>
      <p className="mt-1 text-slate-600">
        {allFounders.length} founder{allFounders.length !== 1 ? "s" : ""} in
        database
      </p>
      <div className="mt-6">
        <FoundersTable founders={allFounders} />
      </div>
    </div>
  );
}
