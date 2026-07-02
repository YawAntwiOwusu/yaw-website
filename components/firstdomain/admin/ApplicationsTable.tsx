"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Application } from "@/lib/firstdomain/db/schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationsTableProps {
  applications: Application[];
  filters: {
    country?: string;
    category?: string;
    launchStage?: string;
    status?: string;
    search?: string;
  };
  countries: string[];
  categories: string[];
  launchStages: string[];
}

export function ApplicationsTable({
  applications,
  filters,
  countries,
  categories,
  launchStages,
}: ApplicationsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/firstdomain/admin/applications?${params.toString()}`);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search founders..."
          defaultValue={filters.search}
          className="max-w-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("search", (e.target as HTMLInputElement).value);
            }
          }}
        />
        <Select
          defaultValue={filters.status || "all"}
          onValueChange={(v) => updateFilter("status", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="winner">Winner</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={filters.country || "all"}
          onValueChange={(v) => updateFilter("country", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={filters.category || "all"}
          onValueChange={(v) => updateFilter("category", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={filters.launchStage || "all"}
          onValueChange={(v) => updateFilter("launchStage", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Launch Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {launchStages.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Founder
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Project
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Country
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Category
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Stage
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Score
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/firstdomain/admin/applications/${app.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {app.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{app.projectName}</td>
                  <td className="px-4 py-3">{app.country}</td>
                  <td className="px-4 py-3">{app.category}</td>
                  <td className="px-4 py-3">{app.launchStage}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize">
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {app.overallScore ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {app.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
