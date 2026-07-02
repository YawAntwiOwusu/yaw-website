import { Check, X } from "lucide-react";
import { landingContent } from "@/lib/firstdomain/content/landing";

export function WhoShouldApply() {
  const { whoShouldApply } = landingContent;
  return (
    <section className="px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        <div className="rounded-[30px] bg-neutral-50 p-8 md:p-12">
          <h2 className="text-2xl font-normal tracking-tight text-neutral-950 md:text-3xl">
            {whoShouldApply.title}
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-500">
            {whoShouldApply.intro}
          </p>
          <ul className="mt-8 space-y-3">
            {whoShouldApply.shouldApply.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-1">
            {whoShouldApply.noNeed.map((line, i) => (
              <p
                key={line}
                className={
                  i === whoShouldApply.noNeed.length - 1
                    ? "text-sm font-medium text-neutral-900"
                    : "text-sm text-neutral-500"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-neutral-200/70 bg-white p-8 md:p-12">
          <h2 className="text-2xl font-normal tracking-tight text-neutral-950 md:text-3xl">
            {whoShouldApply.shouldntTitle}
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-500">
            {whoShouldApply.shouldntIntro}
          </p>
          <ul className="mt-8 space-y-3">
            {whoShouldApply.shouldntApply.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <X className="h-3 w-3 text-neutral-400" />
                </span>
                <span className="text-sm text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-neutral-900">
            {whoShouldApply.shouldntClosing}
          </p>
        </div>
      </div>
    </section>
  );
}
