import { listMediaAssets } from "@/lib/fwd/actions/site-content";
import { MediaLibrary } from "@/components/fwd/MediaLibrary";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";

export const metadata = { title: "Media — FWD" };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let assets: Awaited<ReturnType<typeof listMediaAssets>> = [];
  let error: string | null = null;
  try {
    assets = await listMediaAssets();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load media";
  }

  return (
    <div>
      <FwdPageHeader
        eyebrow="Manage"
        title="Media"
        description="Shared library backed by Vercel Blob."
      />
      {error && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}. Ensure DATABASE_URL and BLOB_READ_WRITE_TOKEN are set, then
          run <code className="font-mono text-xs">npm run db:seed:media</code>.
        </p>
      )}
      <MediaLibrary assets={assets} />
    </div>
  );
}
