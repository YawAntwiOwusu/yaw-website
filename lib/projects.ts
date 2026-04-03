import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "daakye-digital",
    title: "Daakye Digital",
    category: "Project",
    year: "2025",
    description: "Driving innovation and revenue at the intersection of product, design, and growth.",
    image: "/yawlogo.png",
    href: "https://daakyedigital.com",
    internal: false,
  },
  {
    slug: "printmote",
    title: "Printmote",
    category: "Project",
    year: "2025",
    description: "Building digital infrastructure for Africa's $50 billion print economy.",
    image: "/yawlogo.png",
    href: "https://printmote.com",
    internal: false,
  },
  {
    slug: "233founders",
    title: "233Founders",
    category: "Org",
    year: "2025",
    description: "Research and market intelligence on Ghana's digital economy.",
    image: "/yawlogo.png",
    href: "https://233founders.com",
    internal: false,
  },
];

export function getAllProjects(): Project[] {
  return projects;
}
