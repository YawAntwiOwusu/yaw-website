"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface NoteShareBarProps {
  url: string;
  title: string;
  summary: string;
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export default function NoteShareBar({ url, title, summary }: NoteShareBarProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && Boolean(navigator.share));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const encodedUrl = encodeURIComponent(url);
  const shareLine = `${title}\n${url}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareLine)}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const nativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title,
        text: summary || title,
        url,
      });
      setOpen(false);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        /* user cancelled or error */
      }
    }
  }, [title, summary, url]);

  const linkClass =
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100";

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-muted transition-colors hover:border-neutral-300 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Share this note"
      >
        <ShareIcon />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[12.5rem] rounded-xl border border-neutral-200 bg-background py-1 shadow-lg"
          role="menu"
          aria-label="Share options"
        >
          {canNativeShare && (
            <button
              type="button"
              role="menuitem"
              className={linkClass}
              onClick={() => void nativeShare()}
            >
              Share via…
            </button>
          )}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            WhatsApp
          </a>
          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            X (Twitter)
          </a>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            LinkedIn
          </a>
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Facebook
          </a>
          <button
            type="button"
            role="menuitem"
            className={linkClass}
            onClick={() => void copyLink()}
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
