"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { landingContent } from "@/lib/firstdomain/content/landing";
import { cn } from "@/lib/utils";

const ROTATE_INTERVAL_MS = 6000;

export function WhyFirstDomain() {
  const { whyFirstDomain } = landingContent;

  const panels = [
    {
      id: "story",
      label: "It started with $395",
      heading: "It started with $395",
      body: whyFirstDomain.story,
    },
    {
      id: "identity",
      label: "A domain is identity",
      heading: whyFirstDomain.domainIs[0],
      body: whyFirstDomain.domainIs.slice(1),
    },
    {
      id: "builders",
      label: "Builders reach out every week",
      heading: whyFirstDomain.observation[0],
      body: whyFirstDomain.observation.slice(1),
    },
  ];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % panels.length),
      ROTATE_INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, [paused, panels.length]);

  const panel = panels[active];

  return (
    <section className="px-6 py-10">
      <div
        className="mx-auto max-w-6xl rounded-[30px] bg-neutral-50 p-8 md:p-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading, intro, switch list */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
              {whyFirstDomain.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
              {whyFirstDomain.closing.join(" ")}
            </p>
            <Link
              href="/firstdomain/apply"
              className="group mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-neutral-100 py-3.5 pl-5 pr-4 text-[13px] font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
            >
              Apply Now
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="mt-auto space-y-1 pt-10">
              {panels.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors",
                    index === active
                      ? "bg-white font-medium text-neutral-900 shadow-sm ring-1 ring-neutral-200/70"
                      : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                      index === active ? "bg-neutral-900" : "bg-neutral-300"
                    )}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: switching detail card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -right-2 -top-2 hidden h-full w-full rotate-2 rounded-3xl border border-neutral-200/60 bg-white/60 lg:block"
            />
            <div
              key={panel.id}
              className="fd-fade-up relative flex min-h-[320px] flex-col rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-10"
            >
              <h3 className="text-lg font-medium text-neutral-950">
                {panel.heading}
              </h3>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-500">
                {panel.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
