import { listApprovedCommentsForSlug } from "@/lib/fwd/actions/site-content";
import { CommentForm } from "./CommentForm";

export async function NoteComments({ postSlug }: { postSlug: string }) {
  const approved = await listApprovedCommentsForSlug(postSlug);

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-2xl font-bold text-foreground">
        Comments
      </h2>
      <p className="mt-2 text-sm text-muted">
        New comments are moderated before they appear.
      </p>

      <ul className="mt-8 space-y-6">
        {approved.map((comment) => (
          <li key={comment.id} className="border-b border-neutral-100 pb-6">
            <p className="font-medium text-foreground">{comment.authorName}</p>
            <p className="mt-1 text-xs text-muted">
              {comment.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {comment.body}
            </p>
          </li>
        ))}
        {approved.length === 0 && (
          <li className="text-sm text-muted">No comments yet. Be the first.</li>
        )}
      </ul>

      <div className="mt-10">
        <CommentForm postSlug={postSlug} />
      </div>
    </section>
  );
}
