import { PostEditorForm } from "@/components/fwd/PostEditorForm";

export const metadata = { title: "New post — Site — FWD" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New post</h1>
      <p className="mt-1 text-slate-600">Draft or publish a note.</p>
      <div className="mt-6">
        <PostEditorForm />
      </div>
    </div>
  );
}
