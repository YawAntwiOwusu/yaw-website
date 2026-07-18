import { listAdminProjects } from "@/lib/fwd/actions/site-content";
import { ProjectsManager } from "@/components/fwd/ProjectsManager";
import { FwdPageHeader } from "@/components/fwd/FwdPageHeader";

export const metadata = { title: "Projects — FWD" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof listAdminProjects>> = [];
  let error: string | null = null;
  try {
    projects = await listAdminProjects();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load projects";
  }

  return (
    <div>
      <FwdPageHeader
        eyebrow="Manage"
        title="Projects"
        description="Portfolio cards shown on the homepage."
      />
      {error && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}
      <ProjectsManager projects={projects} />
    </div>
  );
}
