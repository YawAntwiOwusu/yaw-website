import { getAllProjects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  const projects = getAllProjects();

  return (
    <section
      id="selected-work"
      className="scroll-mt-24 bg-background page-padding pt-6 pb-16 md:pt-8 md:pb-20"
      aria-labelledby="selected-work-heading"
    >
      <div className="page-container">
        <h2
          id="selected-work-heading"
          className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4"
        >
          Selected Work
        </h2>
        <hr className="border-0 border-b border-neutral-200 mb-10 md:mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
