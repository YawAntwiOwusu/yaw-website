import { listAdminProjects } from "@/lib/fwd/actions/site-content";
import { ProjectsManager } from "@/components/fwd/ProjectsManager";

export const metadata = { title: "Projects — Site — FWD" };
export const dynamic = "force-dynamic";

export default async function SiteProjectsPage() {
  let projects: Awaited<ReturnType<typeof listAdminProjects>> = [];
  let error: string | null = null;
  try {
    projects = await listAdminProjects();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load projects";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
      <p className="mt-1 text-slate-600">
        Portfolio cards shown on the homepage.
      </p>
      {error && (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      )}
      <div className="mt-6">
        <ProjectsManager projects={projects} />
      </div>
    </div>
  );
}
