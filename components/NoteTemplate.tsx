"use client";

import Link from "next/link";
import { NoteCategory } from "@/types/note";
import Image from "next/image";
import NoteShareBar from "./NoteShareBar";

const DEFAULT_AUTHOR = "Yaw Antwi-Owusu";

const AUTHOR_AVATAR_PATH = "THE BERNARD CATALOGUE 2.0 00119_1.jpg";
const AUTHOR_AVATAR_SRC = `/images/${encodeURIComponent(AUTHOR_AVATAR_PATH)}`;

interface NoteTemplateProps {
  title: string;
  category: NoteCategory;
  datePublished: string;
  content: string;
  featuredImage: string;
  author?: string;
  readTimeMinutes?: number;
  shareUrl: string;
  shareSummary: string;
}

export default function NoteTemplate({
  title,
  category,
  datePublished,
  content,
  featuredImage,
  author,
  readTimeMinutes,
  shareUrl,
  shareSummary,
}: NoteTemplateProps) {
  const displayAuthor = author ?? DEFAULT_AUTHOR;

  return (
    <article className="max-w-4xl mx-auto">
      <p className="mb-8">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Back to notes
        </Link>
      </p>

      <div className="mb-6">
        <span className="inline-block px-4 py-2 text-sm font-medium text-muted bg-neutral-100 rounded-full">
          {category}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
        {title}
      </h1>

      {/* Mobile: author + share on one row; date/read time below (avoids cramped 3-col grid). */}
      <div className="mb-8 flex flex-col gap-3 text-sm text-muted sm:hidden">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-1 ring-neutral-200/80">
              <Image
                src={AUTHOR_AVATAR_SRC}
                alt=""
                fill
                className="object-cover object-top"
                sizes="32px"
              />
            </span>
            <span className="min-w-0 truncate text-foreground">{displayAuthor}</span>
          </span>
          <NoteShareBar
            url={shareUrl}
            title={title}
            summary={shareSummary}
          />
        </div>
        <p className="tabular-nums leading-normal text-muted">
          {datePublished}
          {readTimeMinutes != null && (
            <>
              <span aria-hidden className="mx-1.5 text-neutral-300">
                ·
              </span>
              {readTimeMinutes} min read
            </>
          )}
        </p>
      </div>

      <div className="mb-8 hidden w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 text-sm text-muted sm:grid">
        <span className="flex min-w-0 items-center gap-2 justify-self-start overflow-hidden">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-1 ring-neutral-200/80">
            <Image
              src={AUTHOR_AVATAR_SRC}
              alt=""
              fill
              className="object-cover object-top"
              sizes="32px"
            />
          </span>
          <span className="truncate text-foreground">{displayAuthor}</span>
        </span>
        <span className="shrink-0 whitespace-nowrap tabular-nums justify-self-center text-center">
          {datePublished}
          {readTimeMinutes != null && (
            <>
              <span aria-hidden className="mx-1.5 text-neutral-300">
                ·
              </span>
              {readTimeMinutes} min read
            </>
          )}
        </span>
        <div className="flex min-w-0 justify-end justify-self-end overflow-hidden">
          <NoteShareBar
            url={shareUrl}
            title={title}
            summary={shareSummary}
          />
        </div>
      </div>

      {featuredImage && (
        <div className="mb-12 w-full aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="note-content prose prose-lg md:prose-xl max-w-none
          prose-headings:text-foreground prose-headings:font-bold prose-headings:scroll-mt-24
          prose-h3:mt-0 prose-h3:mb-4 prose-h3:text-[1.25rem] md:prose-h3:text-[1.375rem] prose-h3:leading-snug
          prose-p:text-foreground prose-p:mt-0 prose-p:mb-0 prose-p:leading-[1.75] md:prose-p:leading-[1.8]
          prose-p:text-[1.0625rem] md:prose-p:text-[1.125rem]
          prose-a:text-accent prose-a:underline hover:prose-a:opacity-80
          prose-strong:text-foreground prose-strong:font-semibold
          prose-code:text-foreground prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em]
          prose-pre:bg-neutral-100 prose-pre:text-foreground prose-pre:my-8
          prose-blockquote:text-muted prose-blockquote:border-neutral-300 prose-blockquote:my-8 prose-blockquote:pl-6
          prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-li:my-2
          prose-ul:my-6 prose-ol:my-6
          prose-figure:my-10
          prose-img:rounded-xl
          [&_.note-extra-images]:mt-12 [&_.note-extra-images]:space-y-10"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}

