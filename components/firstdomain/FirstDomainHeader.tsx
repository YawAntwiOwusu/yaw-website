import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/firstdomain", label: "Home" },
  { href: "/firstdomain/winners", label: "Winners" },
  { href: "/firstdomain/builders", label: "Builders" },
  { href: "/firstdomain/check-domain", label: "Check Domain" },
];

export function FirstDomainHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/firstdomain" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white">
            FD
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
            First Domain
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/firstdomain/check-domain"
            className="hidden rounded-xl bg-neutral-100 px-4 py-2.5 text-[13px] font-medium text-neutral-900 transition-colors hover:bg-neutral-200 sm:block"
          >
            Check Domain
          </Link>
          <Link
            href="/firstdomain/apply"
            className="rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}
