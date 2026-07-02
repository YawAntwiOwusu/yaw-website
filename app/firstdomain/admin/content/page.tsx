import { desc } from "drizzle-orm";
import { requireDb, winners } from "@/lib/firstdomain/db";
import { ContentManager } from "@/components/firstdomain/admin/ContentManager";

export const metadata = { title: "Content Management" };
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const db = requireDb();
  const allWinners = await db
    .select()
    .from(winners)
    .orderBy(desc(winners.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
      <p className="mt-1 text-slate-600">
        Manage winner stories, announcements, and progress updates
      </p>
      <div className="mt-6">
        <ContentManager winners={allWinners} />
      </div>
    </div>
  );
}
