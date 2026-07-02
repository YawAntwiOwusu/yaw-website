"use client";

import { useTransition } from "react";
import type { ApplicationCycle } from "@/lib/firstdomain/db/schema";
import type { CycleStatus } from "@/lib/firstdomain/types";
import { updateCycleStatus } from "@/lib/firstdomain/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_LABELS: Record<CycleStatus, string> = {
  open: "Applications Open",
  closed: "Applications Closed",
  review: "Review Period",
  complete: "Cycle Complete",
};

const NEXT_STATUS: Partial<Record<CycleStatus, CycleStatus>> = {
  open: "closed",
  closed: "review",
  review: "complete",
  complete: "open",
};

interface CycleControlsProps {
  cycle: ApplicationCycle;
}

export function CycleControls({ cycle }: CycleControlsProps) {
  const [pending, startTransition] = useTransition();

  function handleAdvance() {
    const next = NEXT_STATUS[cycle.status];
    if (!next) return;
    startTransition(async () => {
      await updateCycleStatus(cycle.id, next);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Cycle: {cycle.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            {STATUS_LABELS[cycle.status]}
          </span>
          <div className="text-sm text-slate-500">
            Opens: {cycle.applicationsOpenAt.toLocaleDateString()} · Closes:{" "}
            {cycle.applicationsCloseAt.toLocaleDateString()}
          </div>
          {NEXT_STATUS[cycle.status] && (
            <Button size="sm" onClick={handleAdvance} disabled={pending}>
              {pending
                ? "Updating..."
                : `Move to ${STATUS_LABELS[NEXT_STATUS[cycle.status]!]}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
