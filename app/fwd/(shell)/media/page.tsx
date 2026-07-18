import { listMediaAssets } from "@/lib/fwd/actions/site-content";
import { MediaLibrary } from "@/components/fwd/MediaLibrary";

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
      <h1 className="text-2xl font-bold text-slate-900">Media</h1>
      <p className="mt-1 text-slate-600">
        Shared library backed by Vercel Blob.
      </p>
      {error && (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}. Ensure DATABASE_URL and BLOB_READ_WRITE_TOKEN are set.
        </p>
      )}
      <div className="mt-6">
        <MediaLibrary assets={assets} />
      </div>
    </div>
  );
}
