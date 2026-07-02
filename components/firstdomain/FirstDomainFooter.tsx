import Link from "next/link";

export function FirstDomainFooter() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-neutral-950">
            First Domain
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Helping founders launch with their first domain.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-[13px] text-neutral-500">
          <Link href="/firstdomain/apply" className="hover:text-neutral-900">
            Apply
          </Link>
          <Link href="/firstdomain/winners" className="hover:text-neutral-900">
            Winners
          </Link>
          <Link href="/firstdomain/builders" className="hover:text-neutral-900">
            Builders
          </Link>
          <Link href="/" className="hover:text-neutral-900">
            yawantwiowusu.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
