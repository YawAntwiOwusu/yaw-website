"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MediaAsset } from "@/lib/db";
import {
  uploadMediaAsset,
  deleteMediaAsset,
} from "@/lib/fwd/actions/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [productSlug, setProductSlug] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function onUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("file", file);
        if (productSlug) formData.set("productSlug", productSlug);
        if (alt) formData.set("alt", alt);
        await uploadMediaAsset(formData);
        setAlt("");
        if (inputRef.current) inputRef.current.value = "";
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    });
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  function remove(id: string) {
    if (!window.confirm("Delete this asset?")) return;
    startTransition(async () => {
      await deleteMediaAsset(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-slate-900">Upload</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <Label>Product tag</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value)}
            >
              <option value="">Shared</option>
              <option value="site">Site</option>
              <option value="firstdomain">First Domain</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Alt text</Label>
            <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>
        </div>
        <div className="mt-3">
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files)}
            disabled={pending}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="overflow-hidden rounded-md border border-slate-200 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={asset.alt || asset.filename}
              className="h-40 w-full object-cover bg-slate-100"
            />
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium text-slate-900">
                {asset.filename}
              </p>
              <p className="text-xs text-slate-500">
                {asset.productSlug || "shared"}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copy(asset.url)}
                >
                  {copied === asset.url ? "Copied" : "Copy URL"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => remove(asset.id)}
                  disabled={pending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {assets.length === 0 && (
        <p className="text-sm text-slate-500">
          No media yet. Upload an image to Vercel Blob.
        </p>
      )}
    </div>
  );
}
