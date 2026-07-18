import { listAdminComments } from "@/lib/fwd/actions/site-content";
import { CommentsModerator } from "@/components/fwd/CommentsModerator";
import type { Comment } from "@/lib/db";

export const metadata = { title: "Comments — Site — FWD" };
export const dynamic = "force-dynamic";

export default async function SiteCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && params.status !== "all"
      ? (params.status as Comment["status"])
      : undefined;

  let rows: Awaited<ReturnType<typeof listAdminComments>> = [];
  let error: string | null = null;
  try {
    rows = await listAdminComments(status);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load comments";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
      <p className="mt-1 text-slate-600">
        Approve, spam, or delete comments on notes.
      </p>
      {error && (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      )}
      <div className="mt-6">
        <CommentsModerator
          rows={rows}
          statusFilter={params.status || "all"}
        />
      </div>
    </div>
  );
}
