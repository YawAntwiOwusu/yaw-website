import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/notes";
import type { Note } from "@/types/note";

const DEFAULT_AUTHOR = "Yaw Antwi-Owusu";

interface RelatedNotesProps {
  notes: Note[];
}

export default function RelatedNotes({ notes }: RelatedNotesProps) {
  if (notes.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-neutral-200" aria-labelledby="read-more-heading">
      <h2 id="read-more-heading" className="text-sm font-medium text-muted uppercase tracking-wide mb-8">
        Read more
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/${note.slug}`}
            className="group block"
          >
            <div className="aspect-video relative rounded-lg overflow-hidden bg-neutral-100 mb-3">
              <Image
                src={note.featuredImage}
                alt=""
                fill
                className="object-cover group-hover:opacity-95 transition-opacity"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <h3 className="font-bold text-foreground text-base line-clamp-2 group-hover:text-neutral-600 mb-1">
              {note.title}
            </h3>
            {note.excerpt && (
              <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-2">
                {note.excerpt}
              </p>
            )}
            <p className="text-muted text-xs leading-normal">
              By {note.author ?? DEFAULT_AUTHOR} — {formatDate(note.datePublished)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
