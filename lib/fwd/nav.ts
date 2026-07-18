export type FwdNavItem = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
};

export const manageNav: FwdNavItem[] = [
  { href: "/fwd", label: "Dashboard", match: "exact" },
  { href: "/fwd/blog", label: "Blog", match: "prefix" },
  { href: "/fwd/projects", label: "Projects", match: "prefix" },
  { href: "/fwd/comments", label: "Comments", match: "prefix" },
  { href: "/fwd/media", label: "Media", match: "prefix" },
  { href: "/fwd/analytics", label: "Analytics", match: "prefix" },
];

export const productNav: FwdNavItem[] = [
  {
    href: "/fwd/products/firstdomain",
    label: "First Domain",
    match: "prefix",
  },
];

export const firstDomainSubnav: FwdNavItem[] = [
  { href: "/fwd/products/firstdomain", label: "Overview", match: "exact" },
  {
    href: "/fwd/products/firstdomain/applications",
    label: "Applications",
    match: "prefix",
  },
  {
    href: "/fwd/products/firstdomain/founders",
    label: "Founders",
    match: "prefix",
  },
  {
    href: "/fwd/products/firstdomain/domains",
    label: "Domains",
    match: "prefix",
  },
  {
    href: "/fwd/products/firstdomain/content",
    label: "Content",
    match: "prefix",
  },
];

export function isNavActive(pathname: string, item: FwdNavItem) {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
