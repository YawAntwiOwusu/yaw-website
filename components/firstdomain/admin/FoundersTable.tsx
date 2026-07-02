"use client";

import { useTransition } from "react";
import type { Founder } from "@/lib/firstdomain/db/schema";
import { exportFoundersCsv } from "@/lib/firstdomain/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoundersTableProps {
  founders: Founder[];
}

export function FoundersTable({ founders }: FoundersTableProps) {
  const [pending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const csv = await exportFoundersCsv();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "founders.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <Input placeholder="Search founders..." className="max-w-xs" />
        <Button variant="outline" onClick={handleExport} disabled={pending}>
          {pending ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Startup
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Industry
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Country
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Domain
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Alumni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {founders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No founders yet
                </td>
              </tr>
            ) : (
              founders.map((founder) => (
                <tr key={founder.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{founder.name}</td>
                  <td className="px-4 py-3">{founder.startup}</td>
                  <td className="px-4 py-3">{founder.industry || "—"}</td>
                  <td className="px-4 py-3">{founder.country || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {founder.domain || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {founder.alumniStatus ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                        Alumni
                      </span>
                    ) : (
                      "—"
                    )}
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
