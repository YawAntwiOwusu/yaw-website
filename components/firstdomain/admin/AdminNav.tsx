import Link from "next/link";
import { logoutAction } from "@/lib/firstdomain/auth/admin";

const adminLinks = [
  { href: "/firstdomain/admin", label: "Dashboard" },
  { href: "/firstdomain/admin/applications", label: "Applications" },
  { href: "/firstdomain/admin/founders", label: "Founders" },
  { href: "/firstdomain/admin/domains", label: "Domains" },
  { href: "/firstdomain/admin/content", label: "Content" },
];

export function AdminNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/firstdomain/admin"
            className="font-semibold text-slate-900"
          >
            First Domain Admin
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/firstdomain"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            View Site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
