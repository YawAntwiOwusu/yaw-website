import { notFound } from "next/navigation";
import { getAdminPost } from "@/lib/fwd/actions/site-content";
import { PostEditorForm } from "@/components/fwd/PostEditorForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit post</h1>
      <p className="mt-1 text-slate-600">/{post.slug}</p>
      <div className="mt-6">
        <PostEditorForm post={post} />
      </div>
    </div>
  );
}
