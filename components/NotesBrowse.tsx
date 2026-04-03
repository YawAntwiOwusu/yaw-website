"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NoteCategory, NoteListItem } from "@/types/note";
import { formatDate } from "@/lib/format-note-date";

const DEFAULT_AUTHOR = "Yaw Antwi-Owusu";

type FilterValue = "all" | NoteCategory;

function buildCategoryOptions(items: NoteListItem[]) {
  const counts = new Map<NoteCategory, number>();
  for (const n of items) {
    counts.set(n.category, (counts.get(n.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort(
      (a, b) =>
        b.count - a.count || a.category.localeCompare(b.category)
    );
}

interface NotesBrowseProps {
  items: NoteListItem[];
}

export default function NotesBrowse({ items }: NotesBrowseProps) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const categoryOptions = useMemo(
    () => buildCategoryOptions(items),
    [items]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((n) => n.category === filter);
  }, [items, filter]);

  const filterId = "notes-category-filter";

  return (
    <div className="space-y-8">
      <div
        id={filterId}
        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
        role="group"
        aria-label="Filter notes by category"
      >
        <span className="text-sm font-medium text-muted sm:mr-1 sm:shrink-0">
          Category
        </span>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={items.length}
            selected={filter === "all"}
            onSelect={() => setFilter("all")}
          />
          {categoryOptions.map(({ category, count }) => (
            <FilterChip
              key={category}
              label={category}
              count={count}
              selected={filter === category}
              onSelect={() => setFilter(category)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-lg leading-relaxed">
          No notes in this category.
        </p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          {filtered.map((note) => (
            <li key={note.slug} className="h-full min-w-0">
              <article className="h-full">
                <Link
                  href={`/${note.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-background transition-colors hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 bg-neutral-100">
                    <Image
                      src={note.featuredImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {note.category}
                    </p>
                    <h3 className="text-xl font-bold leading-snug text-foreground group-hover:text-neutral-600 md:text-2xl">
                      {note.title}
                    </h3>
                    {note.excerpt && (
                      <p className="line-clamp-3 text-base leading-relaxed text-foreground/90">
                        {note.excerpt}
                      </p>
                    )}
                    <p className="mt-auto pt-2 text-sm leading-normal text-muted">
                      By {note.author ?? DEFAULT_AUTHOR} —{" "}
                      {formatDate(note.datePublished)}
                    </p>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-neutral-200 bg-background text-foreground hover:border-neutral-300"
      }`}
    >
      <span>{label}</span>
      <span
        className={`tabular-nums ${
          selected ? "text-background/80" : "text-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
