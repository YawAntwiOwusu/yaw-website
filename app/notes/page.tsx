import Header from "@/components/Header";
import { getAllNotes } from "@/lib/notes";
import Link from "next/link";
import { formatDate } from "@/lib/notes";

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <main className="min-h-screen bg-[#02001A] flex flex-col">
      <Header />
      <div className="flex-1 page-padding py-16 md:py-24">
        <div className="page-container">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">
            Notes
          </h1>

          {notes.length === 0 ? (
            <div className="text-white/80 text-lg leading-relaxed">
              <p>No notes published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {notes.map((note) => (
                <article
                  key={note.slug}
                  className="border-b border-white/10 pb-8 last:border-b-0"
                >
                  <Link
                    href={`/notes/${note.slug}`}
                    className="block group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-white/70 bg-white/5 rounded-full mb-3">
                          {note.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-white/80 transition-colors mb-2">
                          {note.title}
                        </h2>
                        {note.excerpt && (
                          <p className="text-white/70 text-lg leading-relaxed">
                            {note.excerpt}
                          </p>
                        )}
                      </div>
                      <time
                        dateTime={note.datePublished}
                        className="text-white/60 text-sm font-medium whitespace-nowrap"
                      >
                        {formatDate(note.datePublished)}
                      </time>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
