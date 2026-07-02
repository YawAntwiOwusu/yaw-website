import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { landingContent } from "@/lib/firstdomain/content/landing";

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
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/firstdomain/apply"
            className="group inline-flex items-center gap-2 rounded-xl bg-white py-3.5 pl-5 pr-4 text-[13px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            {applyCta.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/firstdomain/check-domain"
            className="inline-flex items-center rounded-xl bg-white/10 px-5 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-white/20"
          >
            Check Domain
          </Link>
        </div>
      </div>
    </section>
  );
}
