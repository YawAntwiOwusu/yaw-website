"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNoteBySlug } from "@/lib/notes";

const items = [
  { label: "Notes", href: "/notes" },
  { label: "About", href: "/about" },
] as const;

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const onArticlePage = Boolean(
    firstSegment && getNoteBySlug(firstSegment)
  );

  return (
    <nav
      className={`flex items-center gap-6 md:gap-8 ${className}`}
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const isActive =
          item.href === "/notes"
            ? pathname === "/notes" || onArticlePage
            : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "text-base md:text-lg font-normal text-foreground"
                : "text-base md:text-lg font-normal text-muted hover:text-foreground transition-colors"
            }
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
