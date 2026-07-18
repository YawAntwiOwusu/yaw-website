import { PostEditorForm } from "@/components/fwd/PostEditorForm";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";

export const metadata = { title: "New post — FWD" };

export default function NewPostPage() {
  return (
    <div>
      <FwdPageHeader
        eyebrow="Manage"
        title="New post"
        description="Draft or publish a note."
      />
      <PostEditorForm />
    </div>
  );
}
