"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { landingContent } from "@/lib/firstdomain/content/landing";
import { cn } from "@/lib/utils";

export function FAQ() {
  const { faq } = landingContent;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
          {faq.title}
        </h2>
        <div className="mt-10 space-y-2">
          {faq.items.map((item, index) => (
            <div
              key={item.question}
              className={cn(
                "rounded-2xl border transition-colors",
                openIndex === index
                  ? "border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  : "border-neutral-200/70 bg-neutral-50"
              )}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="text-sm font-medium text-neutral-900">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-neutral-400 transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-neutral-500">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
