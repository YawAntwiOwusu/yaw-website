import { landingContent } from "@/lib/firstdomain/content/landing";
import { DomainSearchCTA } from "@/components/firstdomain/DomainSearchCTA";

export function ApplyCTA() {
  const { applyCta } = landingContent;
  return (
    <section className="px-6 pb-20 pt-10">
      <div className="mx-auto max-w-6xl rounded-[30px] bg-neutral-950 px-8 py-20 text-center md:py-24">
        <h2 className="mx-auto max-w-xl text-3xl font-normal tracking-tight text-white md:text-4xl">
          {applyCta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          {applyCta.body}
        </p>
        <div className="mt-9">
          <p className="mb-4 text-[13px] font-medium text-neutral-300">
            Find an available domain, then continue to your application
          </p>
          <DomainSearchCTA variant="dark" inputId="applyCtaProjectName" />
        </div>
      </div>
    </section>
  );
}
