import { notFound } from "next/navigation";
import { getAdminPost } from "@/lib/fwd/actions/site-content";
import { PostEditorForm } from "@/components/fwd/PostEditorForm";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";

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
      <FwdPageHeader
        eyebrow="Manage"
        title="Edit post"
        description={`/${post.slug}`}
      />
      <PostEditorForm post={post} />
    </div>
  );
}
