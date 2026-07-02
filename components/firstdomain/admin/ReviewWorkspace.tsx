"use client";

import { useState, useTransition } from "react";
import type { Application } from "@/lib/firstdomain/db/schema";
import type { ApplicationStatus } from "@/lib/firstdomain/types";
import { updateApplicationReview } from "@/lib/firstdomain/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SCORE_LABELS = [
  { key: "scoreProductReadiness" as const, label: "Product Readiness" },
  { key: "scoreImpact" as const, label: "Potential Impact" },
  { key: "scoreVision" as const, label: "Clarity of Vision" },
  { key: "scoreExecution" as const, label: "Execution" },
  { key: "scoreLaunchReadiness" as const, label: "Launch Readiness" },
];

type ScoreKey = (typeof SCORE_LABELS)[number]["key"];

interface ReviewWorkspaceProps {
  application: Application;
}

export function ReviewWorkspace({ application }: ReviewWorkspaceProps) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({
    scoreProductReadiness: application.scoreProductReadiness ?? 5,
    scoreImpact: application.scoreImpact ?? 5,
    scoreVision: application.scoreVision ?? 5,
    scoreExecution: application.scoreExecution ?? 5,
    scoreLaunchReadiness: application.scoreLaunchReadiness ?? 5,
  });
  const [internalNotes, setInternalNotes] = useState(
    application.internalNotes ?? ""
  );
  const [builderWallPublic, setBuilderWallPublic] = useState(
    application.builderWallPublic
  );

  const overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / 5
  );

  function handleSave() {
    startTransition(async () => {
      await updateApplicationReview(application.id, {
        status,
        ...scores,
        internalNotes,
        builderWallPublic,
      });
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Founder Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Name:</strong> {application.fullName}
            </p>
            <p>
              <strong>Email:</strong> {application.email}
            </p>
            <p>
              <strong>Country:</strong> {application.country}
            </p>
            <p>
              <strong>Industry:</strong> {application.industry}
            </p>
            {application.linkedin && (
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={application.linkedin}
                  className="text-indigo-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Profile
                </a>
              </p>
            )}
            <p className="pt-2">{application.bio}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Startup Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Project:</strong> {application.projectName}
            </p>
            <p>
              <strong>Category:</strong> {application.category}
            </p>
            <p>
              <strong>Stage:</strong> {application.launchStage}
            </p>
            <p>{application.description}</p>
            {application.demoUrl && (
              <p>
                <a
                  href={application.demoUrl}
                  className="text-indigo-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Demo →
                </a>
              </p>
            )}
            <p>
              <strong>Domain:</strong>{" "}
              <span className="font-mono">{application.desiredDomain}</span>
            </p>
            <p>
              <strong>Launch Timeline:</strong> {application.launchTimeline}
            </p>
            <p className="pt-2 italic">{application.motivation}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review & Scoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ApplicationStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="winner">Winner</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {SCORE_LABELS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between">
                <Label>{label}</Label>
                <span className="text-sm text-slate-500">
                  {scores[key]}/10
                </span>
              </div>
              <Slider
                value={[scores[key]]}
                min={1}
                max={10}
                step={1}
                onValueChange={([v]) =>
                  setScores((prev) => ({ ...prev, [key]: v }))
                }
              />
            </div>
          ))}

          <div className="rounded-lg bg-slate-100 p-4 text-center">
            <p className="text-sm text-slate-500">Overall Recommendation</p>
            <p className="text-3xl font-bold text-indigo-600">{overall}/10</p>
          </div>

          <div>
            <Label htmlFor="internalNotes">Internal Notes</Label>
            <Textarea
              id="internalNotes"
              rows={4}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="builderWallPublic">Builder Wall Public</Label>
            <Switch
              id="builderWallPublic"
              checked={builderWallPublic}
              onCheckedChange={setBuilderWallPublic}
            />
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="w-full"
          >
            {pending ? "Saving..." : "Save Review"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
