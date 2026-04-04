import { Project } from "@/types/project";

/** Card art in `public/project-cards/` (filenames with spaces are URL-encoded). */
function projectCardImage(filename: string): string {
  return `/project-cards/${encodeURIComponent(filename)}`;
}

export const projects: Project[] = [
  {
    slug: "printmote",
    title: "Printmote",
    category: "Company",
    year: "2025",
    description: "Building digital infrastructure for Africa's $50 billion print economy.",
    image: projectCardImage("Printmote card.png"),
    href: "https://printmote.com",
    internal: false,
  },
  {
    slug: "233founders",
    title: "233Founders",
    category: "Ecosystem Development",
    year: "2025",
    description: "Research and market intelligence on Ghana's digital economy.",
    image: projectCardImage("233Founders card.png"),
    href: "https://233founders.com",
    internal: false,
  },
  {
    slug: "cursor-ghana",
    title: "Cursor Ghana",
    category: "Community",
    year: "2025",
    description:
      "First Cursor Community Meetup in Ghana at MEST Africa; Cursor Ambassador growing the local builder community.",
    image: projectCardImage("Cursor Ghana card.png"),
    href: "https://www.linkedin.com/posts/yawantwiowusu_cursoringhana-ghanatechtotheworld-communitybuilding-activity-7368301839840210944-6ZBd?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAABGvI_IB3ulAm7ibFYvoI7t11d_-IR5GEZk",
    internal: false,
  },
  {
    slug: "pubfas",
    title: "PubFas",
    category: "AI Experiment",
    year: "2026",
    description:
      "Generate high-CTR YouTube titles, SEO tags, chapter timestamps, thumbnail captions, and full descriptions in seconds.",
    image: projectCardImage("PubFas card.png"),
    href: "http://pubfas.com",
    internal: false,
  },
];

export function getAllProjects(): Project[] {
  return projects;
}
