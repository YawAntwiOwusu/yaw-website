"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Comment } from "@/lib/db";
import {
  moderateComment,
  deleteComment,
} from "@/lib/fwd/actions/site-content";
import { Button } from "@/components/ui/button";

type Row = {
  comment: Comment;
  postTitle: string;
  postSlug: string;
};

export function CommentsModerator({
  rows,
  statusFilter,
}: {
  rows: Row[];
  statusFilter: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(id: string, status: Comment["status"]) {
    startTransition(async () => {
      await moderateComment(id, status);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this comment?")) return;
    startTransition(async () => {
      await deleteComment(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "approved", "spam", "rejected"].map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            asChild
          >
            <Link
              href={
                status === "all"
                  ? "/fwd/comments"
                  : `/fwd/comments?status=${status}`
              }
            >
              {status}
            </Link>
          </Button>
        ))}
      </div>

      <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
        {rows.map(({ comment, postTitle, postSlug }) => (
          <li key={comment.id} className="space-y-2 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">
                  {comment.authorName}{" "}
                  <span className="font-normal text-slate-500">
                    &lt;{comment.authorEmail}&gt;
                  </span>
                </p>
                <p className="text-sm text-slate-500">
                  on{" "}
                  <Link href={`/${postSlug}`} className="underline">
                    {postTitle}
                  </Link>{" "}
                  · {comment.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setStatus(comment.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setStatus(comment.id, "spam")}
                >
                  Spam
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setStatus(comment.id, "rejected")}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => remove(comment.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {comment.body}
            </p>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="px-4 py-6 text-sm text-slate-500">
            No comments in this filter.
          </li>
        )}
      </ul>
    </div>
  );
}
