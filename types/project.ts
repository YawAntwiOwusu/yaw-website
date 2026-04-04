export type ProjectCategory =
  | "Project"
  | "Event Series"
  | "Event"
  | "Internship"
  | "Org"
  | "Community"
  | "Company"
  | "Ecosystem Development"
  | "AI Experiment";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  description?: string;
  image: string;
  href: string; // external URL or internal path
  internal?: boolean; // if true, href is internal (e.g. /work/themes-shopify)
}
