"use client";

import { useState, useTransition } from "react";
import { submitPublicComment } from "@/lib/fwd/actions/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CommentForm({ postSlug }: { postSlug: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [body, setBody] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitPublicComment({
        postSlug,
        authorName,
        authorEmail,
        body,
      });
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      setDone(true);
      setAuthorName("");
      setAuthorEmail("");
      setBody("");
    });
  }

  if (done) {
    return (
      <p className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-foreground">
        Thanks — your comment was submitted and is awaiting moderation.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Leave a comment</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="authorName">Name</Label>
          <Input
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="authorEmail">Email</Label>
          <Input
            id="authorEmail"
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="body">Comment</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit comment"}
      </Button>
    </form>
  );
}
