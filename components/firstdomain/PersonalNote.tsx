import { landingContent } from "@/lib/firstdomain/content/landing";

export function PersonalNote() {
  const { personalNote } = landingContent;
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
          {personalNote.title}
        </h2>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-neutral-500">
          {personalNote.paragraphs.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-10 text-[15px] font-medium text-neutral-950">
          {personalNote.signature}
        </p>
      </div>
    </section>
  );
}
