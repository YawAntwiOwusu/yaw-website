"use client";

import { useTransition } from "react";
import type { Winner } from "@/lib/firstdomain/db/schema";
import { publishWinner, addWinnerUpdate } from "@/lib/firstdomain/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentManagerProps {
  winners: Winner[];
}

export function ContentManager({ winners }: ContentManagerProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Winner Stories</h2>
        <div className="mt-4 space-y-4">
          {winners.length === 0 ? (
            <p className="text-slate-500">No winners yet</p>
          ) : (
            winners.map((winner) => (
              <Card key={winner.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {winner.projectName} — {winner.founderName}
                    </span>
                    <span
                      className={`text-xs font-normal ${
                        winner.published ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {winner.published ? "Published" : "Draft"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    action={(formData) => {
                      startTransition(async () => {
                        await publishWinner(
                          winner.id,
                          formData.get("story") as string
                        );
                      });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor={`story-${winner.id}`}>Launch Story</Label>
                      <Textarea
                        id={`story-${winner.id}`}
                        name="story"
                        rows={6}
                        defaultValue={winner.story ?? ""}
                        placeholder="Write the founder's launch story..."
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={pending}>
                      {pending ? "Saving..." : "Publish Story"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {winners.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Add Progress Update
          </h2>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <form
                action={(formData) => {
                  startTransition(async () => {
                    await addWinnerUpdate(
                      formData.get("winnerId") as string,
                      formData.get("title") as string,
                      formData.get("body") as string
                    );
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label>Winner</Label>
                  <select
                    name="winnerId"
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    required
                  >
                    {winners.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="updateTitle">Title</Label>
                  <Input id="updateTitle" name="title" required />
                </div>
                <div>
                  <Label htmlFor="updateBody">Update</Label>
                  <Textarea id="updateBody" name="body" rows={4} required />
                </div>
                <Button type="submit" size="sm" disabled={pending}>
                  Add Update
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
