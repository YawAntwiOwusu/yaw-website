import { landingContent } from "@/lib/firstdomain/content/landing";

export function HowItWorks() {
  const { howItWorks } = landingContent;
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
          {howItWorks.title}
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {howItWorks.steps.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-neutral-200/70 bg-neutral-50 p-6"
            >
              <span className="text-xs text-neutral-400">{step.step}</span>
              <h3 className="mt-3 text-[15px] font-medium text-neutral-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
