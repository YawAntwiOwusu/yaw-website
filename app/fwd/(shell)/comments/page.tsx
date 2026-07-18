import { listAdminComments } from "@/lib/fwd/actions/site-content";
import { CommentsModerator } from "@/components/fwd/CommentsModerator";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";
import type { Comment } from "@/lib/db";

export const metadata = { title: "Comments — FWD" };
export const dynamic = "force-dynamic";

export default async function CommentsPage({
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
      <FwdPageHeader
        eyebrow="Manage"
        title="Comments"
        description="Approve, spam, or delete comments on notes."
      />
      {error && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}
      <CommentsModerator rows={rows} statusFilter={params.status || "all"} />
    </div>
  );
}
