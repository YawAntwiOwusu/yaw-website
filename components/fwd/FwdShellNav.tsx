import Link from "next/link";
import { logoutAction } from "@/lib/fwd/auth/admin";
import { products } from "@/lib/fwd/products";

const platformLinks = [
  { href: "/fwd", label: "Hub" },
  { href: "/fwd/media", label: "Media" },
  { href: "/fwd/analytics", label: "Analytics" },
];

export function FwdShellNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/fwd" className="shrink-0 font-semibold text-slate-900">
            FWD
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {platformLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            <span className="text-slate-300">|</span>
            {products.map((product) => (
              <Link
                key={product.slug}
                href={product.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {product.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            View site
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
