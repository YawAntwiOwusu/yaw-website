import { getAllNotes } from "@/lib/notes";
import type { NoteListItem } from "@/types/note";
import NotesBrowse from "./NotesBrowse";

function toListItems(notes: ReturnType<typeof getAllNotes>): NoteListItem[] {
  return notes.map(
    ({ content: _content, ...rest }) => rest
  );
}

export default function NotesSection() {
  const notes = getAllNotes();
  const listItems = toListItems(notes);

  return (
    <section
      id="notes"
      className="scroll-mt-24 border-t border-neutral-200 py-16 md:py-24 page-padding"
      aria-labelledby="notes-heading"
    >
      <div className="page-container">
        <h2
          id="notes-heading"
          className="mb-10 text-4xl font-bold text-foreground md:mb-12 md:text-5xl"
        >
          Notes
        </h2>

        {listItems.length === 0 ? (
          <div className="text-lg leading-relaxed text-muted">
            <p>No notes published yet. Check back soon!</p>
          </div>
        ) : (
          <NotesBrowse items={listItems} />
        )}
      </div>
    </section>
  );
}
