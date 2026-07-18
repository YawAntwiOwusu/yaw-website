import { listPublishedNoteItems } from "@/lib/site/content";
import NotesBrowse from "./NotesBrowse";

export default async function NotesSection() {
  const listItems = await listPublishedNoteItems();

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
