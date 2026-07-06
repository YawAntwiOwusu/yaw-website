import { landingContent } from "@/lib/firstdomain/content/landing";
import { DomainSearchCTA } from "@/components/firstdomain/DomainSearchCTA";

export function HeroSection() {
  const { hero } = landingContent;
  const [lead, ...rest] = hero.subtitle.split("\n\n");

  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* soft layered grey shapes for the open-space feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rotate-12 rounded-[4rem] bg-neutral-100/80 blur-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-40 h-80 w-80 -rotate-12 rounded-[4.5rem] bg-neutral-100/60 blur-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rotate-45 rounded-[3.5rem] bg-neutral-50 blur-sm"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-medium tracking-tight text-neutral-950 md:text-[3.25rem] md:leading-[1.1]">
          {hero.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-neutral-500">
          {lead}
        </p>

        <div className="mt-9">
          <p className="mb-4 text-[13px] font-medium text-neutral-700">
            Search for your domain to get started
          </p>
          <DomainSearchCTA id="search" />
        </div>

        {rest.length > 0 && (
          <div className="mx-auto mt-14 max-w-xl space-y-3 text-sm leading-relaxed text-neutral-400">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
