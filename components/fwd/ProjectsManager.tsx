"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectRow } from "@/lib/db";
import { upsertProject, deleteProject } from "@/lib/fwd/actions/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "Project",
  "Event Series",
  "Event",
  "Internship",
  "Org",
  "Community",
  "Company",
  "Ecosystem Development",
  "AI Experiment",
];

const emptyForm = {
  id: undefined as string | undefined,
  title: "",
  slug: "",
  category: CATEGORIES[0],
  year: new Date().getFullYear().toString(),
  description: "",
  image: "",
  href: "",
  internal: false,
  sortOrder: 0,
  published: true,
};

export function ProjectsManager({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function edit(project: ProjectRow) {
    setForm({
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      year: project.year,
      description: project.description ?? "",
      image: project.image,
      href: project.href,
      internal: project.internal,
      sortOrder: project.sortOrder,
      published: project.published,
    });
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await upsertProject(form);
        setForm(emptyForm);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this project?")) return;
    startTransition(async () => {
      await deleteProject(id);
      if (form.id === id) setForm(emptyForm);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {form.id ? "Edit project" : "New project"}
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Year</Label>
              <Input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
          <div>
            <Label>Link</Label>
            <Input
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
                }
              />
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={form.internal}
                onChange={(e) =>
                  setForm({ ...form, internal: e.target.checked })
                }
              />
              Internal link
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" onClick={save} disabled={pending || !form.title || !form.image || !form.href}>
              {pending ? "Saving…" : form.id ? "Update" : "Create"}
            </Button>
            {form.id && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm(emptyForm)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">All projects</h2>
        <ul className="mt-4 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-start justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{project.title}</p>
                <p className="text-sm text-slate-500">
                  {project.category} · {project.year} ·{" "}
                  {project.published ? "Published" : "Hidden"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => edit(project)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => remove(project.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {projects.length === 0 && (
            <li className="px-4 py-6 text-sm text-slate-500">
              No projects yet. Create one or run `npm run db:seed:site`.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
