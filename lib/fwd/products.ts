export type ProductSlug = "site" | "firstdomain";

export type FwdProduct = {
  slug: ProductSlug;
  name: string;
  description: string;
  href: string;
  nav: { href: string; label: string }[];
};

export const products: FwdProduct[] = [
  {
    slug: "site",
    name: "Site",
    description: "Blog, projects, and comments for yawantwiowusu.com",
    href: "/fwd/products/site",
    nav: [
      { href: "/fwd/products/site", label: "Overview" },
      { href: "/fwd/products/site/blog", label: "Blog" },
      { href: "/fwd/products/site/projects", label: "Projects" },
      { href: "/fwd/products/site/comments", label: "Comments" },
    ],
  },
  {
    slug: "firstdomain",
    name: "First Domain",
    description: "Applications, founders, domains, and winner content",
    href: "/fwd/products/firstdomain",
    nav: [
      { href: "/fwd/products/firstdomain", label: "Overview" },
      { href: "/fwd/products/firstdomain/applications", label: "Applications" },
      { href: "/fwd/products/firstdomain/founders", label: "Founders" },
      { href: "/fwd/products/firstdomain/domains", label: "Domains" },
      { href: "/fwd/products/firstdomain/content", label: "Content" },
    ],
  },
] as const;

export function getProduct(slug: string): FwdProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function productSlugFromPath(path: string): ProductSlug {
  if (path.startsWith("/firstdomain") || path.startsWith("/fwd/products/firstdomain")) {
    return "firstdomain";
  }
  return "site";
}
