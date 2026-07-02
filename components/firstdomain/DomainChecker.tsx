"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DomainResult {
  domain: string;
  available: boolean;
  price?: string;
}

interface DomainCheckerProps {
  initialProjectName?: string;
  onSelectDomain?: (domain: string, price?: string) => void;
  selectedDomain?: string;
  compact?: boolean;
}

export function DomainChecker({
  initialProjectName = "",
  onSelectDomain,
  selectedDomain,
  compact = false,
}: DomainCheckerProps) {
  const [projectName, setProjectName] = useState(initialProjectName);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    if (!projectName.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("/api/firstdomain/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: projectName.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to check domains");
      }
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn(compact && "border-0 shadow-none")}>
      {!compact && (
        <CardHeader>
          <CardTitle>Domain Availability Checker</CardTitle>
          <p className="text-sm text-slate-500">
            Enter your project name to see available domains across supported
            TLDs.
          </p>
        </CardHeader>
      )}
      <CardContent className={cn(compact && "p-0")}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="projectName" className="sr-only">
              Project Name
            </Label>
            <Input
              id="projectName"
              placeholder="e.g. PrintBible"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
          </div>
          <Button onClick={handleCheck} disabled={loading || !projectName.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Check"
            )}
          </Button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Suggested domains for &ldquo;{projectName}&rdquo;
            </p>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {results.map((result) => (
                <li
                  key={result.domain}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    onSelectDomain &&
                      result.available &&
                      "cursor-pointer hover:bg-slate-50",
                    selectedDomain === result.domain && "bg-indigo-50"
                  )}
                  onClick={() =>
                    result.available &&
                    onSelectDomain?.(result.domain, result.price)
                  }
                >
                  <div className="flex items-center gap-3">
                    {result.available ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                    <span className="font-mono text-sm">{result.domain}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.price && result.available && (
                      <span className="text-sm text-slate-500">
                        ~${result.price}/yr
                      </span>
                    )}
                    {onSelectDomain && result.available && (
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          selectedDomain === result.domain
                            ? "default"
                            : "outline"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDomain(result.domain, result.price);
                        }}
                      >
                        {selectedDomain === result.domain ? "Selected" : "Select"}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
