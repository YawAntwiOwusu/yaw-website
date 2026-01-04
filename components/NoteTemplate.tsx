"use client";

import { NoteCategory } from "@/types/note";
import Image from "next/image";

interface NoteTemplateProps {
  title: string;
  category: NoteCategory;
  datePublished: string; // Formatted date for display
  datePublishedISO?: string; // ISO date string for dateTime attribute
  url: string;
  content: string;
  featuredImage: string;
}

export default function NoteTemplate({
  title,
  category,
  datePublished,
  datePublishedISO,
  url,
  content,
  featuredImage,
}: NoteTemplateProps) {
  const handleCopyUrl = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Category Badge */}
      <div className="mb-6">
        <span className="inline-block px-4 py-2 text-sm font-medium text-white/80 bg-white/10 rounded-full">
          {category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        {title}
      </h1>

      {/* Metadata */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-12 text-white/70 text-sm md:text-base">
        <time dateTime={datePublishedISO || datePublished} className="font-medium">
          {datePublished}
        </time>
        <span className="hidden md:inline">•</span>
        <a
          href={url}
          className="hover:text-white transition-colors underline break-all"
          onClick={handleCopyUrl}
        >
          {url}
        </a>
      </div>

      {/* Featured Image */}
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

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-p:text-white/90 prose-p:leading-relaxed
          prose-a:text-white prose-a:underline hover:prose-a:text-white/80
          prose-strong:text-white prose-strong:font-semibold
          prose-code:text-white/90 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-white/5 prose-pre:text-white/90
          prose-blockquote:text-white/80 prose-blockquote:border-white/20
          prose-ul:text-white/90 prose-ol:text-white/90
          prose-li:text-white/90"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}

