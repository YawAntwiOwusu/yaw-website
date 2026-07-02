import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { landingContent } from "@/lib/firstdomain/content/landing";

export function ProgramOverview() {
  const { overview } = landingContent;
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-md text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
            {overview.title}
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
            {overview.description}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {overview.breakdown.map((item) => (
            <div
              key={item.eyebrow}
              className="flex flex-col rounded-2xl border border-neutral-200/70 bg-neutral-50 p-7"
            >
              <p className="text-xs text-neutral-400">{item.eyebrow}</p>
              <h3 className="mt-3 text-[15px] font-medium text-neutral-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="group mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white py-3 pl-4 pr-3.5 text-[13px] font-medium text-neutral-900 ring-1 ring-neutral-200/80 transition-colors hover:bg-neutral-100"
              >
                {item.linkLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-neutral-400">
          {overview.closing.join(" ")}
        </p>
      </div>
    </section>
  );
}
