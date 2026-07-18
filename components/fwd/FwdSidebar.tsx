"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  ImageIcon,
  BarChart3,
  Package,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/lib/fwd/auth/admin";
import {
  manageNav,
  productNav,
  firstDomainSubnav,
  isNavActive,
} from "@/lib/fwd/nav";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Blog: FileText,
  Projects: Briefcase,
  Comments: MessageSquare,
  Media: ImageIcon,
  Analytics: BarChart3,
  "First Domain": Package,
};

export function FwdSidebar() {
  const pathname = usePathname();
  const onFirstDomain = pathname.startsWith("/fwd/products/firstdomain");

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-neutral-950 text-neutral-200">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/fwd" className="block font-semibold tracking-tight text-white">
          /FWD
        </Link>
        <p className="mt-1 text-xs text-neutral-400">Admin dashboard</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div>
          <p className="px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            Manage
          </p>
          <ul className="mt-2 space-y-0.5">
            {manageNav.map((item) => {
              const Icon = icons[item.label] ?? LayoutDashboard;
              const active = isNavActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            Products
          </p>
          <ul className="mt-2 space-y-0.5">
            {productNav.map((item) => {
              const Icon = icons[item.label] ?? Package;
              const active = isNavActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    {item.label}
                  </Link>
                  {onFirstDomain && item.href.includes("firstdomain") && (
                    <ul className="mt-1 ml-4 space-y-0.5 border-l border-white/10 pl-3">
                      {firstDomainSubnav.map((sub) => {
                        const subActive = isNavActive(pathname, sub);
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`block rounded-md px-2 py-1.5 text-xs transition-colors ${
                                subActive
                                  ? "text-white"
                                  : "text-neutral-500 hover:text-neutral-200"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="mb-1 block rounded-md px-2.5 py-2 text-sm text-neutral-500 hover:bg-white/5 hover:text-neutral-200"
        >
          View site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
